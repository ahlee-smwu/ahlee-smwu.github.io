import { atom, read, update } from 'claude-code'
import type { EngineInterface, Register } from 'claude-code'

import type { Tab } from '../types'
import {
  baseName,
  editLines,
  isBinary,
  lineOf,
  numberedBlock,
  pageFrom,
  parseRange,
  previousTop,
  relativeTo,
  replaceLine,
  splitArgs,
  splitLines,
  topFor,
} from './text'

const PANE = 'file-tabs'
const TITLE = '파일'

const tabs = atom({ plugin: 'file-tabs', key: 'tabs' } as const, [])
const active = atom({ plugin: 'file-tabs', key: 'active' } as const, null)
const editing = atom({ plugin: 'file-tabs', key: 'editing' } as const, null)
const isDismissed = atom({ plugin: 'file-tabs', key: 'isDismissed' } as const, false)
const revision = atom({ plugin: 'file-tabs', key: 'revision' } as const, 0)

type Engine = EngineInterface
type Touch = { isAuto: boolean; isChanged: boolean; line: number | null }

/** Pinned tabs first, each group in the order it was opened. */
const ordered = (list: readonly Tab[]): Tab[] => [
  ...list.filter(tab => tab.isPinned),
  ...list.filter(tab => !tab.isPinned),
]

/** The absolute path of a regular file, links resolved; undefined otherwise. */
const resolveFile = async ($: Engine, path: string): Promise<string | undefined> => {
  const stat = await $.fs.stat(path, { resolve: true }).catch(() => undefined)

  return stat?.kind === 'file' ? (stat.realPath ?? path) : undefined
}

const readText = async ($: Engine, path: string): Promise<string> => String(await $.fs.read(path))

const pinsKey = async ($: Engine): Promise<string> => `pins:${await $.session.root()}`

const savePins = async ($: Engine): Promise<void> => {
  const list = await read($, tabs)
  await $.store.set(await pinsKey($), list.filter(tab => tab.isPinned).map(tab => tab.path))
}

/** Drops the oldest unpinned auto tabs past `max`, never `keep`. */
const trimAuto = (list: Tab[], max: number, keep: string): Tab[] => {
  let extra = list.filter(tab => tab.isAuto && !tab.isPinned).length - max
  if (extra <= 0) return list

  return list.filter(tab => {
    const isDropped = extra > 0 && tab.isAuto && !tab.isPinned && tab.path !== keep
    if (isDropped) extra -= 1

    return !isDropped
  })
}

const touch = async ($: Engine, path: string, how: Touch, maxAutoTabs: number): Promise<void> => {
  await update($, tabs, list => {
    const found = list.find(tab => tab.path === path)
    if (found) {
      const top = how.line === null ? found.top : topFor(how.line)
      const changed: Tab = {
        ...found,
        isChanged: found.isChanged || how.isChanged,
        changedLine: how.isChanged ? how.line : found.changedLine,
        top,
      }

      return list.map(tab => (tab.path === path ? changed : tab))
    }
    const tab: Tab = {
      path,
      isPinned: false,
      isAuto: how.isAuto,
      isChanged: how.isChanged,
      changedLine: how.isChanged ? how.line : null,
      top: how.line === null ? 1 : topFor(how.line),
    }

    return trimAuto([...list, tab], maxAutoTabs, path)
  })
  await update($, active, () => path)
  await update($, revision, n => n + 1)
}

/** Opens the pane: always when the person asked, else unless they closed it. */
const showPane = async ($: Engine, isAsked: boolean): Promise<void> => {
  if (isAsked) {
    await update($, isDismissed, () => false)
    await $.ui.open({ id: PANE, title: TITLE, focus: true })

    return
  }
  if (await read($, isDismissed)) return
  const panes = await $.ui.panes()
  if (!panes.some(pane => pane.id === PANE)) await $.ui.open({ id: PANE, title: TITLE })
}

/** After a tool touched a file: a tab for it, on the changed line. */
const afterTool = async (
  $: Engine,
  path: string,
  how: Touch,
  maxAutoTabs: number,
  needle?: string,
): Promise<void> => {
  const real = await resolveFile($, path)
  if (real === undefined) return
  let line = how.line
  if (needle !== undefined) line = lineOf(await readText($, real), needle)
  await touch($, real, { ...how, line }, maxAutoTabs)
  await showPane($, false)
}

export const register: Register = (on, options) => {
  const autoOpen =
    options.autoOpen === 'off' || options.autoOpen === 'edits-and-reads' ? options.autoOpen : 'edits'
  const maxAutoTabs =
    typeof options.maxAutoTabs === 'number' && options.maxAutoTabs >= 1
      ? Math.floor(options.maxAutoTabs)
      : 8

  on('session.start', async ($, e, next) => {
    await $.command.register({
      name: 'open',
      description: '파일을 파일 탭 패널에서 엽니다 (인자 없으면 패널만 열기)',
      argumentHint: '<경로> [줄]',
    })
    await $.command.register({
      name: 'view',
      description: '파일 내용을 대화에 띄웁니다 (원격 기기에서 보기용)',
      argumentHint: '<경로> [시작-끝]',
    })

    const saved = await $.store.get(await pinsKey($))
    const pinned = Array.isArray(saved) ? saved.filter(p => typeof p === 'string') : []
    const present: string[] = []
    for (const path of pinned) {
      if ((await resolveFile($, path)) !== undefined) present.push(path)
    }
    if (present.length > 0) {
      await update($, tabs, list => {
        const known = new Set(list.map(tab => tab.path))
        const restored = present
          .filter(path => !known.has(path))
          .map(path => ({
            path,
            isPinned: true,
            isAuto: false,
            isChanged: false,
            changedLine: null,
            top: 1,
          }))

        return [...restored, ...list]
      })
      await showPane($, false)
    }

    return next(e)
  })

  on('command.run', { command: 'open' }, async ($, e) => {
    const [given, rest] = splitArgs(e.args)
    if (given === '') {
      await showPane($, true)

      return { text: '파일 패널을 열었어요.' }
    }
    const path = await resolveFile($, given)
    if (path === undefined) return { text: `열 수 없어요: ${given} (없는 파일이거나 폴더예요)` }
    const { from } = parseRange(rest)
    await touch($, path, { isAuto: false, isChanged: false, line: from ?? null }, maxAutoTabs)
    await showPane($, true)

    return { text: `파일 패널에서 열었어요: ${relativeTo(await $.session.root(), path)}` }
  })

  on('command.run', { command: 'view' }, async ($, e) => {
    const [given, rest] = splitArgs(e.args)
    if (given === '') return { text: '사용법: /view <경로> [시작-끝]   예) /view README.md 1-80' }
    const path = await resolveFile($, given)
    if (path === undefined) return { text: `열 수 없어요: ${given} (없는 파일이거나 폴더예요)` }
    const content = await readText($, path).catch(() => undefined)
    if (content === undefined) return { text: `읽을 수 없어요: ${given} (4MB가 넘는 파일은 못 읽어요)` }
    if (isBinary(content)) return { text: `이진 파일이라 표시할 수 없어요: ${given}` }
    const { from, to } = parseRange(rest)
    const page = pageFrom(splitLines(content), from ?? 1, to)
    const shown = relativeTo(await $.session.root(), path)
    if (page.total === 0) return { text: `${shown}: 빈 파일이에요.` }
    const more = page.end < page.total ? `\n다음: /view ${given} ${page.end + 1}-${page.end + 120}` : ''

    return {
      text: `${shown} (${page.top}–${page.end} / ${page.total}줄)\n\n${numberedBlock(page.source, page.top, path)}${more}`,
    }
  })

  on('tool.call', { tool: 'Edit' }, async ($, e, next) => {
    const ran = await next(e)
    if (autoOpen === 'off' || ran.deny !== undefined || ran.isError === true) return ran
    await afterTool($, e.file_path, { isAuto: true, isChanged: true, line: null }, maxAutoTabs, e.new_string).catch(
      () => undefined,
    )

    return ran
  })

  on('tool.call', { tool: 'Write' }, async ($, e, next) => {
    const ran = await next(e)
    if (autoOpen === 'off' || ran.deny !== undefined || ran.isError === true) return ran
    await afterTool($, e.file_path, { isAuto: true, isChanged: true, line: 1 }, maxAutoTabs).catch(() => undefined)

    return ran
  })

  on('tool.call', { tool: 'NotebookEdit' }, async ($, e, next) => {
    const ran = await next(e)
    if (autoOpen === 'off' || ran.deny !== undefined || ran.isError === true) return ran
    await afterTool($, e.notebook_path, { isAuto: true, isChanged: true, line: null }, maxAutoTabs).catch(
      () => undefined,
    )

    return ran
  })

  on('tool.call', { tool: 'Read' }, async ($, e, next) => {
    const ran = await next(e)
    if (autoOpen !== 'edits-and-reads' || ran.deny !== undefined || ran.isError === true) return ran
    const line = typeof e.offset === 'number' ? e.offset : null
    await afterTool($, e.file_path, { isAuto: true, isChanged: false, line }, maxAutoTabs).catch(() => undefined)

    return ran
  })

  on('ui.close', async ($, e, next) => {
    if (e.id === PANE && e.origin.kind === 'person') await update($, isDismissed, () => true)

    return next(e)
  })

  on('ui.render', { component: 'Pane', requestId: PANE }, async ($, e) => {
    const { Box, Button, Code, Text } = $.ui.resolve(e)
    const list = ordered(await read($, tabs))
    const current = await read($, active)
    const edit = await read($, editing)
    await read($, revision)

    if (list.length === 0) {
      return (
        <Box flexDirection="column">
          <Text dimColor>열린 파일이 없어요.</Text>
          <Text dimColor>{'/open <경로> 로 열거나, Claude가 파일을 수정하면 여기 자동으로 열려요.'}</Text>
        </Box>
      )
    }

    const tab = list.find(one => one.path === current) ?? list[0]!
    const root = await $.session.root()
    const content = await readText($, tab.path).catch(() => undefined)
    const lines = content === undefined || isBinary(content) ? [] : splitLines(content)
    const page = pageFrom(lines, tab.top)

    const setTop = (top: number) =>
      update($, tabs, all => all.map(one => (one.path === tab.path ? { ...one, top } : one)))

    const select = async (path: string) => {
      await update($, active, () => path)
      await update($, editing, () => null)
    }

    const togglePin = async () => {
      await update($, tabs, all =>
        all.map(one => (one.path === tab.path ? { ...one, isPinned: !one.isPinned } : one)),
      )
      await savePins($)
    }

    const close = async () => {
      const rest = (await read($, tabs)).filter(one => one.path !== tab.path)
      await update($, tabs, all => all.filter(one => one.path !== tab.path))
      await update($, active, now => (now === tab.path ? (ordered(rest)[0]?.path ?? null) : now))
      await update($, editing, now => (now?.path === tab.path ? null : now))
    }

    const chooseLine = async (value: string) => {
      const line = Number(value.trim())
      const fresh = editLines(await readText($, tab.path))
      if (!Number.isInteger(line) || line < 1 || line > fresh.length) {
        $.ui.toast(`1부터 ${fresh.length} 사이의 줄 번호를 넣어 주세요.`)

        return
      }
      await update($, editing, () => ({ path: tab.path, step: 'text', line, original: fresh[line - 1] ?? '' }))
      await setTop(topFor(line))
    }

    const save = async (value: string) => {
      const now = await read($, editing)
      if (now === null || now.step !== 'text') return
      const fresh = await readText($, now.path)
      const changed = replaceLine(fresh, now.line, now.original, value)
      if (changed === null) {
        $.ui.toast('그 사이 파일이 바뀌어서 저장하지 않았어요. ↻ 새로고침 후 다시 해 주세요.')

        return
      }
      await $.fs.write(now.path, changed)
      await update($, editing, () => null)
      await update($, revision, n => n + 1)
      $.ui.toast(`${baseName(now.path)} ${now.line}번째 줄을 저장했어요.`)
    }

    const label = (one: Tab) =>
      `${one.isPinned ? '📌 ' : ''}${one.isChanged ? '✎ ' : ''}${baseName(one.path)}`

    const where =
      content === undefined
        ? '읽을 수 없음'
        : isBinary(content)
          ? '이진 파일'
          : page.total === 0
            ? '빈 파일'
            : `${page.top}–${page.end} / ${page.total}줄`
    const note =
      tab.isChanged && tab.changedLine !== null
        ? ` · ✎ ${tab.changedLine}번째 줄 근처를 Claude가 수정함`
        : tab.isChanged
          ? ' · ✎ Claude가 수정함'
          : ''

    let body = <Code source={page.source} path={tab.path} startLine={page.top} wrap="truncate-end" />
    if (content === undefined) body = <Text color="red">파일을 읽을 수 없어요 (지워졌거나 4MB를 넘어요).</Text>
    else if (isBinary(content)) body = <Text dimColor>이진 파일이라 표시할 수 없어요.</Text>
    else if (page.total === 0) body = <Text dimColor>(빈 파일)</Text>

    let editor = null
    if (e.surface !== 'mobile' && edit !== null && edit.path === tab.path) {
      const { Input } = $.ui.resolve(e)
      editor =
        edit.step === 'line' ? (
          <Input
            key="edit-line"
            label="수정할 줄 번호:"
            value={String(edit.line)}
            submitLabel="다음"
            autoFocus
            onSubmit={value => void chooseLine(value)}
          />
        ) : (
          <Input
            key="edit-text"
            label={`${edit.line}:`}
            value={edit.original}
            submitLabel="저장"
            autoFocus
            onSubmit={value => void save(value)}
          />
        )
    }

    const canEdit = e.surface !== 'mobile' && content !== undefined && !isBinary(content)

    return (
      <Box flexDirection="column">
        <Box flexDirection="row" flexWrap="wrap" columnGap={1}>
          {list.map((one, i) => (
            <Button
              key={`tab-${i}`}
              label={label(one)}
              variant={one.path === tab.path ? 'primary' : 'secondary'}
              dimColor={one.path !== tab.path}
              hotkey={i < 9 ? String(i + 1) : undefined}
              onPress={() => void select(one.path)}
            />
          ))}
        </Box>
        <Text dimColor wrap="truncate-start">
          {relativeTo(root, tab.path)}
        </Text>
        <Text dimColor>
          {where}
          {note}
        </Text>
        {body}
        {editor}
        <Box flexDirection="row" flexWrap="wrap" columnGap={1}>
          {page.top > 1 && (
            <Button key="prev" label="◀ 이전" hotkey="p" onPress={() => void setTop(previousTop(lines, page.top))} />
          )}
          {page.end < page.total && (
            <Button key="next" label="다음 ▶" hotkey="n" onPress={() => void setTop(page.end + 1)} />
          )}
          <Button
            key="pin"
            label={tab.isPinned ? '📌 고정 해제' : '📌 고정'}
            hotkey="f"
            onPress={() => void togglePin()}
          />
          {canEdit &&
            (edit !== null && edit.path === tab.path ? (
              <Button key="edit-cancel" label="수정 취소" hotkey="e" onPress={() => void update($, editing, () => null)} />
            ) : (
              <Button
                key="edit"
                label="✎ 줄 수정"
                hotkey="e"
                onPress={() =>
                  void update($, editing, () => ({
                    path: tab.path,
                    step: 'line',
                    line: tab.changedLine ?? page.top,
                    original: '',
                  }))
                }
              />
            ))}
          <Button key="refresh" label="↻ 새로고침" hotkey="r" onPress={() => void update($, revision, n => n + 1)} />
          {!tab.isPinned && <Button key="close" label="× 탭 닫기" hotkey="x" onPress={() => void close()} />}
        </Box>
      </Box>
    )
  })
}

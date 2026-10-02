import type { On, RenderPropsOf } from 'claude-code'
import type { Engine } from 'claude-code/testing'
import { expect, test } from 'claude-code/testing'

const ROOT = '/proj'
const PANE: RenderPropsOf['Pane'] = {
  title: '파일',
  isFocused: true,
  bodyColumns: 60,
  placement: 'dock',
  scroll: { offset: 0, bodyRows: 30 },
  view: {},
}
const MOUNT = { plugin: 'file-tabs', component: 'Pane', requestId: 'file-tabs', props: PANE } as const

type World = {
  files: Record<string, string>
  opened: string[]
  toasts: string[]
  store: Record<string, unknown>
}

const numbered = (count: number): string =>
  Array.from({ length: count }, (_, i) => `line ${i + 1}`).join('\n') + '\n'

/** The machine beneath the plugin: files under ROOT, panes, toasts, the store. */
const world = (
  on: On,
  files: Record<string, string>,
  { store = {}, isToolError = false }: { store?: Record<string, unknown>; isToolError?: boolean } = {},
): World => {
  const w: World = { files: { ...files }, opened: [], toasts: [], store: { ...store } }
  // A relative path reaches `fs` resolved against the process's directory
  // (the plugin folder under test); the test files all sit at ROOT's top.
  const abs = (path: string) => (path.startsWith(`${ROOT}/`) ? path : `${ROOT}/${path.split(/[\\/]/).pop()}`)

  on('session.start', ($, e) => ({ cwd: e.cwd }))
  on('session.root', () => ({ value: ROOT }))
  on('command.register', ($, e) => ({ value: { command: e.name } }))
  on('fs.stat', ($, e) => {
    const path = abs(e.path)
    const text = w.files[path]
    if (text === undefined) return { deny: `ENOENT: ${path}` }

    return { value: { kind: 'file', size: text.length, mtimeMs: 0, isLink: false, realPath: path } }
  })
  on('fs.read', ($, e) => {
    const text = w.files[abs(e.path)]

    return text === undefined ? { deny: `ENOENT: ${e.path}` } : { value: text }
  })
  on('fs.write', ($, e) => {
    w.files[abs(e.path)] = e.text

    return { value: undefined }
  })
  on('ui.open', ($, e) => {
    if (!w.opened.includes(e.id)) w.opened.push(e.id)

    return { value: { isPlaced: true } }
  })
  on('ui.panes', () => ({
    value: w.opened.map(id => ({ id, title: '파일', isShown: true, isFocused: false, isPlaced: true })),
  }))
  on('ui.toast', ($, e) => {
    w.toasts.push(e.text)

    return { value: undefined }
  })
  on('store.get', ($, e) => ({ value: w.store[e.key] }))
  on('store.set', ($, e) => {
    w.store[e.key] = e.value

    return { value: undefined }
  })
  on('tool.call', () => (isToolError ? { result: 'failed' as never, isError: true } : { result: {} as never }))

  return w
}

const start = ($: Engine) => $.session.start({ cwd: ROOT, surface: 'terminal', isInteractive: true })

/** The person typing `/<command> <args>` at the prompt. */
const run = ($: Engine, command: string, args: string) =>
  $.command.run({
    command,
    args,
    origin: { kind: 'composer' },
    presentation: { isFullscreen: true, columns: 160 },
  })

test('an edit by Claude opens a tab on the changed line, on every surface', async ($, on) => {
  const w = world(on, { '/proj/_data/news.yml': numbered(30).replace('line 20', 'NEW ITEM') })
  await start($)

  await $.tool.call({
    tool: 'Edit',
    tool_use_id: 't1',
    file_path: '/proj/_data/news.yml',
    old_string: 'line 20',
    new_string: 'NEW ITEM',
  })

  expect(w.opened).toEqual(['file-tabs'])
  for (const surface of ['terminal', 'desktop', 'vscode', 'mobile'] as const) {
    const ui = await $.ui.mount({ ...MOUNT, surface })
    expect(await ui.find({ type: 'Button', text: '✎ news.yml' })).toBeDefined()
    expect(await ui.find({ type: 'Text', text: '20번째 줄 근처를 Claude가 수정함' })).toBeDefined()
    expect(await ui.find({ type: 'Code', text: 'NEW ITEM' })).toBeDefined()
    await ui.unmount()
  }
})

test('a failed edit opens nothing', async ($, on) => {
  const w = world(on, { '/proj/a.txt': 'a\n' }, { isToolError: true })
  await start($)

  await $.tool.call({ tool: 'Edit', tool_use_id: 't1', file_path: '/proj/a.txt', old_string: 'x', new_string: 'y' })

  expect(w.opened).toEqual([])
})

test('auto tabs stop at the limit, oldest first, pinned ones kept', { options: { maxAutoTabs: 2 } }, async ($, on) => {
  world(on, { '/proj/a.txt': 'a\n', '/proj/b.txt': 'b\n', '/proj/c.txt': 'c\n', '/proj/p.txt': 'p\n' })
  await start($)

  await $.tool.call({ tool: 'Write', tool_use_id: 't0', file_path: '/proj/p.txt', content: 'p\n' })
  const ui = await $.ui.mount({ ...MOUNT, surface: 'terminal' })
  await ui.press({ key: 'pin' })
  for (const name of ['a', 'b', 'c']) {
    await $.tool.call({ tool: 'Write', tool_use_id: `t-${name}`, file_path: `/proj/${name}.txt`, content: `${name}\n` })
  }

  const labels = (await ui.findAll({ type: 'Button' })).map(one => one.text).filter(text => text.includes('.txt'))
  expect(labels).toEqual(['📌 ✎ p.txt', '✎ b.txt', '✎ c.txt'])
})

test('reads open tabs only when asked to', { options: { autoOpen: 'edits-and-reads' } }, async ($, on) => {
  const w = world(on, { '/proj/README.md': numbered(50) })
  await start($)

  await $.tool.call({ tool: 'Read', tool_use_id: 't1', file_path: '/proj/README.md', offset: 30 })

  expect(w.opened).toEqual(['file-tabs'])
  const ui = await $.ui.mount({ ...MOUNT, surface: 'desktop' })
  expect(await ui.find({ type: 'Button', text: 'README.md' })).toBeDefined()
  expect(await ui.find({ type: 'Text', text: '25–50 / 50줄' })).toBeDefined()
})

test('reads open nothing by default', async ($, on) => {
  const w = world(on, { '/proj/README.md': numbered(5) })
  await start($)

  await $.tool.call({ tool: 'Read', tool_use_id: 't1', file_path: '/proj/README.md' })

  expect(w.opened).toEqual([])
})

test('/open opens a tab; a pin is stored and comes back next session', async ($, on) => {
  const w = world(on, { '/proj/README.md': numbered(5) })
  await start($)

  const ran = await run($, 'open', 'README.md')
  expect(ran.text).toBe('파일 패널에서 열었어요: README.md')
  const ui = await $.ui.mount({ ...MOUNT, surface: 'terminal' })
  await ui.press({ key: 'pin' })

  expect(w.store['pins:/proj']).toEqual(['/proj/README.md'])
  expect(await ui.find({ type: 'Button', text: '📌 README.md' })).toBeDefined()
  expect(await ui.find({ key: 'close' })).toBeUndefined()
})

test('pinned files reopen when a session starts', async ($, on) => {
  const w = world(on, { '/proj/README.md': numbered(5) }, {
    store: { 'pins:/proj': ['/proj/README.md', '/proj/gone.md'] },
  })
  await start($)

  expect(w.opened).toEqual(['file-tabs'])
  const ui = await $.ui.mount({ ...MOUNT, surface: 'desktop' })
  const labels = (await ui.findAll({ type: 'Button' })).map(one => one.text)
  expect(labels).toContain('📌 README.md')
  expect(labels.some(text => text.includes('gone.md'))).toBe(false)
})

test('/open names a missing file plainly', async ($, on) => {
  world(on, {})
  await start($)

  const ran = await run($, 'open', 'nope.md')
  expect(ran.text).toBe('열 수 없어요: nope.md (없는 파일이거나 폴더예요)')
})

test('pages move forward and back', async ($, on) => {
  world(on, { '/proj/big.txt': numbered(450) })
  await start($)
  await run($, 'open', 'big.txt')

  const ui = await $.ui.mount({ ...MOUNT, surface: 'terminal' })
  expect(await ui.find({ type: 'Text', text: '1–200 / 450줄' })).toBeDefined()
  expect(await ui.find({ key: 'prev' })).toBeUndefined()
  await ui.press({ key: 'next' })
  expect(await ui.find({ type: 'Text', text: '201–400 / 450줄' })).toBeDefined()
  await ui.press({ key: 'next' })
  expect(await ui.find({ type: 'Text', text: '401–450 / 450줄' })).toBeDefined()
  expect(await ui.find({ key: 'next' })).toBeUndefined()
  await ui.press({ key: 'prev' })
  expect(await ui.find({ type: 'Text', text: '201–400 / 450줄' })).toBeDefined()
})

test('a line edit writes that line alone and keeps CRLF endings', async ($, on) => {
  const w = world(on, { '/proj/notes.txt': 'one\r\ntwo\r\nthree\r\n' })
  await start($)
  await run($, 'open', 'notes.txt')

  for (const surface of ['terminal', 'desktop', 'vscode'] as const) {
    const ui = await $.ui.mount({ ...MOUNT, surface })
    expect(await ui.find({ key: 'edit' })).toBeDefined()
    await ui.unmount()
  }

  const ui = await $.ui.mount({ ...MOUNT, surface: 'desktop' })
  await ui.press({ key: 'edit' })
  await ui.input({ key: 'edit-line', text: '2' })
  expect((await ui.find({ key: 'edit-text' }))?.text).toBe('two')
  await ui.input({ key: 'edit-text', text: 'TWO!' })

  expect(w.files['/proj/notes.txt']).toBe('one\r\nTWO!\r\nthree\r\n')
  expect(w.toasts).toEqual(['notes.txt 2번째 줄을 저장했어요.'])
  expect(await ui.find({ key: 'edit-text' })).toBeUndefined()
})

test('a line edit refuses when the file changed meanwhile', async ($, on) => {
  const w = world(on, { '/proj/notes.txt': 'one\ntwo\n' })
  await start($)
  await run($, 'open', 'notes.txt')

  const ui = await $.ui.mount({ ...MOUNT, surface: 'terminal' })
  await ui.press({ key: 'edit' })
  await ui.input({ key: 'edit-line', text: '2' })
  w.files['/proj/notes.txt'] = 'one\nchanged by Claude\n'
  await ui.input({ key: 'edit-text', text: 'mine' })

  expect(w.files['/proj/notes.txt']).toBe('one\nchanged by Claude\n')
  expect(w.toasts[0]).toContain('저장하지 않았어요')
})

test('a line number out of range is refused', async ($, on) => {
  const w = world(on, { '/proj/notes.txt': 'one\ntwo\n' })
  await start($)
  await run($, 'open', 'notes.txt')

  const ui = await $.ui.mount({ ...MOUNT, surface: 'terminal' })
  await ui.press({ key: 'edit' })
  await ui.input({ key: 'edit-line', text: '99' })

  expect(w.toasts[0]).toContain('줄 번호')
  expect(await ui.find({ key: 'edit-text' })).toBeUndefined()
})

test('mobile shows the file without edit controls', async ($, on) => {
  world(on, { '/proj/notes.txt': 'one\ntwo\n' })
  await start($)
  await run($, 'open', 'notes.txt')

  const ui = await $.ui.mount({ ...MOUNT, surface: 'mobile' })
  expect(await ui.find({ type: 'Code', text: 'two' })).toBeDefined()
  expect(await ui.find({ key: 'edit' })).toBeUndefined()
  expect(await ui.find({ key: 'pin' })).toBeDefined()
})

test('closing a tab moves to the next one', async ($, on) => {
  world(on, { '/proj/a.txt': 'a\n', '/proj/b.txt': 'b\n' })
  await start($)
  await run($, 'open', 'a.txt')
  await run($, 'open', 'b.txt')

  const ui = await $.ui.mount({ ...MOUNT, surface: 'terminal' })
  await ui.press({ key: 'close' })
  const labels = (await ui.findAll({ type: 'Button' })).map(one => one.text).filter(text => text.includes('.txt'))
  expect(labels).toEqual(['a.txt'])
  expect(await ui.find({ type: 'Code', text: 'a' })).toBeDefined()
})

test('/open with no file opens the pane alone', async ($, on) => {
  const w = world(on, {})
  await start($)

  const ran = await run($, 'open', '')
  expect(ran.text).toBe('파일 패널을 열었어요.')
  expect(w.opened).toEqual(['file-tabs'])
  const ui = await $.ui.mount({ ...MOUNT, surface: 'terminal' })
  expect(await ui.find({ type: 'Text', text: '열린 파일이 없어요.' })).toBeDefined()
})

test('/view prints numbered lines for remote devices', async ($, on) => {
  world(on, { '/proj/README.md': numbered(300) })
  await start($)

  const ran = await run($, 'view', 'README.md 2-3')
  expect(ran.text).toBe('README.md (2–3 / 300줄)\n\n```md\n2  line 2\n3  line 3\n```\n다음: /view README.md 4-123')
})

test('/view fences code that holds backticks', async ($, on) => {
  world(on, { '/proj/a.md': 'x\n```js\ny\n```\n' })
  await start($)

  const ran = await run($, 'view', 'a.md')
  expect(ran.text).toContain('````md\n')
  expect(ran.text?.endsWith('\n````')).toBe(true)
})

test('a tenth tab draws without a hotkey', async ($, on) => {
  const files = Object.fromEntries(Array.from({ length: 10 }, (_, i) => [`/proj/f${i}.txt`, `${i}\n`]))
  world(on, files)
  await start($)
  for (let i = 0; i < 10; i++) await run($, 'open', `f${i}.txt`)

  for (const surface of ['terminal', 'desktop', 'mobile'] as const) {
    const ui = await $.ui.mount({ ...MOUNT, surface })
    const labels = (await ui.findAll({ type: 'Button' })).map(one => one.text).filter(text => text.includes('.txt'))
    expect(labels).toHaveLength(10)
    await ui.press({ key: 'tab-9' })
    expect(await ui.find({ type: 'Code', text: '9' })).toBeDefined()
    await ui.unmount()
  }
})

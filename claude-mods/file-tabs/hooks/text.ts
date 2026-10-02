// Pure text helpers: paging a file for the pane, locating edits, and the
// one-line replace. No `$` here, so the tests can reason about them directly.

/** Lines on one page; the pane scrolls within a page. */
export const PAGE_LINES = 200
/** Characters on one page: `Code` takes at most 10,000. */
export const PAGE_CHARS = 9000
/** A longer line is cut for display (minified files). */
const LONG_LINE = 2000

export type Page = {
  /** First line shown, 1-based. */
  top: number
  /** Last line shown, 1-based; top - 1 when the file is empty. */
  end: number
  total: number
  /** The lines shown, joined by newlines, safe for `Code`. */
  source: string
}

/** The file's lines as an editor numbers them. */
export const splitLines = (text: string): string[] => {
  const lines = text.split(/\r?\n/)
  if (lines.length > 1 && lines[lines.length - 1] === '') lines.pop()

  return text === '' ? [] : lines
}

export const isBinary = (text: string): boolean => text.includes('\u0000')

/** `Code` holds no control character but tab and newline. */
const clean = (line: string): string => {
  const shown = line.replace(/[\u0000-\u0008\u000b-\u001f\u007f]/g, '�')

  return shown.length > LONG_LINE ? `${shown.slice(0, LONG_LINE)}…` : shown
}

const shownLength = (line: string): number => Math.min(line.length, LONG_LINE + 1) + 1

/** The page starting at `top`, up to `last` when given. */
export const pageFrom = (lines: readonly string[], top: number, last?: number): Page => {
  const total = lines.length
  const start = Math.min(Math.max(1, Math.floor(top)), Math.max(1, total))
  const stop = Math.min(total, last ?? total)
  const out: string[] = []
  let chars = 0

  for (let n = start; n <= stop && out.length < PAGE_LINES; n++) {
    const line = clean(lines[n - 1] ?? '')
    if (out.length > 0 && chars + line.length + 1 > PAGE_CHARS) break
    out.push(line)
    chars += line.length + 1
  }

  return { top: start, end: start + out.length - 1, total, source: out.join('\n') }
}

/** Where the page before the one starting at `top` starts. */
export const previousTop = (lines: readonly string[], top: number): number => {
  let chars = 0
  let count = 0
  let n = top - 1

  for (; n >= 1 && count < PAGE_LINES; n--) {
    const length = shownLength(lines[n - 1] ?? '')
    if (count > 0 && chars + length > PAGE_CHARS) break
    chars += length
    count += 1
  }

  return Math.max(1, n + 1)
}

/** A page top that shows `line` with a little context above it. */
export const topFor = (line: number): number => Math.max(1, line - 5)

/** The 1-based line where `needle` first appears, or null. */
export const lineOf = (content: string, needle: string): number | null => {
  if (needle === '') return null
  const at = content.indexOf(needle)

  return at < 0 ? null : content.slice(0, at).split('\n').length
}

const eolOf = (content: string): string => (content.includes('\r\n') ? '\r\n' : '\n')

/** The lines as the one-line edit numbers and rewrites them. */
export const editLines = (content: string): string[] => content.split(eolOf(content))

/**
 * `content` with line `line` replaced by `text`, keeping the file's line
 * endings; null when the line is out of range or no longer reads `original`.
 */
export const replaceLine = (
  content: string,
  line: number,
  original: string,
  text: string,
): string | null => {
  const eol = eolOf(content)
  const parts = content.split(eol)
  if (!Number.isInteger(line) || line < 1 || line > parts.length) return null
  if (parts[line - 1] !== original) return null
  parts[line - 1] = text

  return parts.join(eol)
}

/** `<path> [rest]`, the path optionally in double quotes. */
export const splitArgs = (args: string): [string, string] => {
  const trimmed = args.trim()
  const quoted = /^"([^"]+)"\s*(.*)$/.exec(trimmed)
  if (quoted) return [quoted[1] ?? '', quoted[2] ?? '']
  const plain = /^(\S+)\s*(.*)$/.exec(trimmed)

  return plain ? [plain[1] ?? '', plain[2] ?? ''] : ['', '']
}

/** `12` or `12-40` (`12:40`, `12~40`); undefined parts when absent. */
export const parseRange = (text: string): { from?: number; to?: number } => {
  const match = /^(\d+)(?:\s*[-:~]\s*(\d+))?$/.exec(text.trim())
  if (!match) return {}
  const from = Number(match[1])
  const to = match[2] === undefined ? undefined : Number(match[2])

  return { from, to }
}

export const baseName = (path: string): string => path.split(/[\\/]/).pop() || path

/** `path` relative to `root` when inside it. */
export const relativeTo = (root: string, path: string): string => {
  const base = root.replace(/[\\/]+$/, '')
  const isInside = path.startsWith(`${base}/`) || path.startsWith(`${base}\\`)

  return isInside ? path.slice(base.length + 1) : path
}

/** A Markdown code block of `lines` numbered from `top`, fenced safely. */
export const numberedBlock = (source: string, top: number, path: string): string => {
  const lines = source === '' ? [] : source.split('\n')
  const width = String(top + Math.max(0, lines.length - 1)).length
  const body = lines.map((line, i) => `${String(top + i).padStart(width)}  ${line}`).join('\n')
  const longest = Math.max(0, ...(body.match(/`+/g) ?? []).map(run => run.length))
  const fence = '`'.repeat(Math.max(3, longest + 1))
  const extension = /\.([A-Za-z0-9]+)$/.exec(baseName(path))?.[1]?.toLowerCase() ?? ''

  return `${fence}${extension}\n${body}\n${fence}`
}

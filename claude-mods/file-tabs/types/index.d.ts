/** One file open in the pane. `path` is absolute, symbolic links resolved. */
export type Tab = {
  path: string
  isPinned: boolean
  /** Opened by the plugin because Claude touched the file, not by the person. */
  isAuto: boolean
  /** Claude edited the file this session. */
  isChanged: boolean
  /** Where Claude's last edit landed, 1-based; null when unknown. */
  changedLine: number | null
  /** First line of the page on screen, 1-based. */
  top: number
}

/** The one-line edit in progress: first the line number, then its text. */
export type Editing = {
  path: string
  step: 'line' | 'text'
  line: number
  /** The line as it read when editing began; a save refuses if it changed. */
  original: string
}

declare module 'claude-code' {
  interface PluginState {
    'file-tabs': {
      tabs: Tab[]
      active: string | null
      editing: Editing | null
      isDismissed: boolean
      revision: number
    }
  }
}

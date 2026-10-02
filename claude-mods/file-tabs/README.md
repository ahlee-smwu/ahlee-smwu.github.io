# file-tabs — Claude Code 파일 탭 패널 mod

Claude Code 세션 옆에 **파일 탭 패널**을 띄우는 mod(함수 훅 플러그인)입니다.

- 파일 하나가 탭 하나. 탭을 눌러 전환합니다.
- **📌 고정(핀)**: 고정한 탭은 맨 앞에 오고, 같은 프로젝트에서 새 세션을 열면 자동으로 다시 열립니다.
- **자동 탭 추가**: Claude가 파일을 수정하면 그 파일이 `✎` 표시와 함께 탭으로 열리고, 바뀐 줄 근처로 이동합니다.
- **✎ 줄 수정**: 터미널, 데스크톱 앱, VS Code에서 한 줄씩 직접 고칠 수 있습니다(모바일 앱은 입력칸을 아직 지원하지 않아 보기 전용).
- **`/view`**: 파일 내용을 대화에 띄웁니다. Remote Control로 휴대폰이나 웹에서 볼 때 쓰세요.

> 데스크톱 앱의 기본 파일 뷰어를 바꾸는 것이 아니라, 그 옆에 쓸 수 있는 **별도 패널**입니다.
> Mods API는 초기 버전이라 Claude Code 업데이트 때 바뀔 수 있습니다(2.1.287에서 작성·테스트).

## 설치 (로컬 PC에서 한 번)

### 1. 받기

macOS / Linux:

```bash
git clone --depth 1 --branch claude/compassionate-fermat-lajasx \
  https://github.com/ahlee-smwu/ahlee-smwu.github.io.git ~/file-tabs-src
```

Windows (PowerShell):

```powershell
git clone --depth 1 --branch claude/compassionate-fermat-lajasx `
  https://github.com/ahlee-smwu/ahlee-smwu.github.io.git $HOME\file-tabs-src
```

mod 폴더는 `~/file-tabs-src/claude-mods/file-tabs` 입니다.

### 2. 모든 세션에서 불러오도록 설정

`~/.claude/settings.json` (Windows: `C:\Users\<이름>\.claude\settings.json`)의 `env`에 한 줄을 **추가**합니다.
파일에 이미 다른 설정이 있으면 지우지 말고 `env` 안에만 넣으세요.

macOS / Linux:

```json
{
  "env": {
    "CLAUDE_CODE_PLUGIN_DIRS": "~/file-tabs-src/claude-mods/file-tabs"
  }
}
```

Windows:

```json
{
  "env": {
    "CLAUDE_CODE_PLUGIN_DIRS": "C:\\Users\\<이름>\\file-tabs-src\\claude-mods\\file-tabs"
  }
}
```

mod가 여러 개면 경로를 macOS·Linux는 `:`, Windows는 `;`로 이어 씁니다.
반드시 **사용자 설정**(`~/.claude/settings.json`)에 넣어야 합니다. 프로젝트의 `.claude/settings.json`은 이 값을 읽지 않습니다.

### 3. 세션 다시 시작

- **터미널**: 새로 여는 `claude` 세션부터 적용됩니다. 이미 열린 세션은 종료 후 다시 여세요.
- **데스크톱 앱**: 앱을 완전히 종료했다가 다시 실행하세요.
- **Remote Control**: mod는 PC의 Claude Code에서 돌기 때문에, 위 설정이 된 PC에서 `claude remote-control`이나 데스크톱 앱으로 연 세션이면 따로 할 일이 없습니다.

입력창에 `/open`을 쳐서 자동완성에 나오면 설치된 것입니다.

설정 없이 한 번만 써 보려면: `claude --plugin-dir ~/file-tabs-src/claude-mods/file-tabs`

### 업데이트

```bash
git -C ~/file-tabs-src pull
```

## 사용법

| 하는 일 | 방법 |
| --- | --- |
| 파일 열기 | `/open <경로> [줄]` (예: `/open _config.yml 40`), 공백이 있으면 `"따옴표"` |
| 패널만 열기 | `/open` |
| 휴대폰에서 파일 보기 | `/view <경로> [시작-끝]` (예: `/view README.md 1-80`) |
| 탭 전환 | 탭 클릭, 또는 패널에서 숫자 `1`~`9` |
| 이전/다음 페이지 | `◀ 이전`(`p`) / `다음 ▶`(`n`) — 한 페이지 최대 200줄 |
| 고정 / 해제 | `📌 고정`(`f`) |
| 한 줄 고치기 | `✎ 줄 수정`(`e`) → 줄 번호 Enter → 내용 고치고 Enter |
| 새로고침 | `↻ 새로고침`(`r`) |
| 탭 닫기 | `× 탭 닫기`(`x`) — 고정한 탭은 고정 해제 후 닫힘 |

- 터미널에서 패널에 키보드를 옮기려면 패널을 클릭하거나 `ctrl+x` 다음 `tab`을 누르세요. `Esc`는 프롬프트로 돌아갑니다.
- 패널을 직접 닫으면, 이번 세션에서는 Claude가 파일을 고쳐도 패널이 다시 튀어나오지 않습니다(탭은 계속 쌓임). `/open`으로 다시 여세요.
- 터미널 폭이 좁으면(144칸 미만) 세션 시작 때 고정 탭 패널이 자동으로 뜨지 않고 기다립니다. `/open`으로 여세요.
- 한 줄 수정은 저장 직전에 그 줄이 처음 본 내용 그대로인지 확인합니다. 그사이 Claude가 파일을 바꿨으면 저장하지 않고 알려 줍니다.
- `/view`로 띄운 내용은 Claude도 읽기 때문에 컨텍스트(토큰)를 씁니다.

## 설정 (`/config`)

설치 후 `/config`에 이 mod의 두 항목이 나옵니다.

| 항목 | 값 | 기본값 |
| --- | --- | --- |
| 자동 탭 추가 (`autoOpen`) | `edits`: Claude가 수정한 파일만 · `edits-and-reads`: 읽은 파일도 · `off`: 끄기 | `edits` |
| 자동 탭 최대 개수 (`maxAutoTabs`) | 자동으로 열린 탭(고정 안 한 것)이 이 수를 넘으면 오래된 것부터 닫음 | `8` |

`~/.claude/settings.json`에 직접 적어도 됩니다.

```json
{
  "pluginConfigs": {
    "file-tabs": { "options": { "autoOpen": "edits", "maxAutoTabs": 8 } }
  }
}
```

## 개발

```bash
claude plugin validate .   # 매니페스트와 훅 검사
claude plugin test .       # tests/*.test.tsx 실행
```

이 폴더는 웹사이트 저장소의 `claude/compassionate-fermat-lajasx` 브랜치에만 있습니다. 사이트(main)에 합치면 Jekyll이 이 파일들을 그대로 공개하므로, 합치지 말고 받아 쓰는 용도로만 두세요.

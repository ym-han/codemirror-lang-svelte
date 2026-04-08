# CodeMirror Svelte Mode

This is a CodeMirror 6 extension that adds support for Svelte.

> [!NOTE] This is a fork of [Kynson/codemirror-lang-svelte](https://github.com/Kynson/codemirror-lang-svelte), itself a fork of the MIT licensed [@replit/codemirror-lang-svelte](https://github.com/replit/codemirror-lang-svelte/tree/main).

## Features
- Svelte 5 template syntax (Attachment, Snippet, Render, `{@const}`, `{@html}`, `{@debug}`)
- Autocomplete for all Svelte 5 runes (`$state`, `$derived`, `$effect`, `$props`, `$bindable`, `$inspect`, `$host`, and sub-APIs like `$state.raw`, `$state.eager`, `$effect.pending`, etc.)
- Autocomplete for Svelte block syntax, directives, and `svelte:` special elements
- SvelteKit-specific `data-sveltekit-*` attribute completions

## Installation

Install from this fork's GitHub repository:

```bash
# npm
npm install github:ym-han/codemirror-lang-svelte#fixes

# pnpm
pnpm add github:ym-han/codemirror-lang-svelte#fixes

# yarn
yarn add ym-han/codemirror-lang-svelte#fixes

# bun
bun add github:ym-han/codemirror-lang-svelte#fixes
```

Or add it directly to `package.json`:

```json
{
  "dependencies": {
    "codemirror-lang-svelte": "github:ym-han/codemirror-lang-svelte#fixes"
  }
}
```

The package builds automatically on install via the `prepare` script.

### Peer Dependencies

This package requires the following peer dependencies (you likely already have these if you use CodeMirror 6):

- `@codemirror/autocomplete`, `@codemirror/lang-css`, `@codemirror/lang-html`, `@codemirror/lang-javascript`, `@codemirror/language`, `@codemirror/state`, `@codemirror/view`
- `@lezer/common`, `@lezer/highlight`, `@lezer/lr`

_As some parts are partially rewritten, the behaviour is slightly different from `@replit/codemirror-lang-svelte`. This version tends to be stricter towards grammar than the original one._

### API Reference

```typescript
svelte(config: Config): LanguageSupport
```
**Config:**
- [`jsParser: LRParser`](https://lezer.codemirror.net/docs/ref/#lr.LRParser) \
  Javascript parser used to parse nodes inside `<script>` tags and template javascript expressions. \
  Default: `javascriptLanguage.parser` from [`@codemirror/lang-javascript`](https://github.com/codemirror/lang-javascript/tree/main) \
  Useful for providing a parser with custom configs (e.g. overriding syntax highlighting)

- [`tsParser: LRParser`](https://lezer.codemirror.net/docs/ref/#lr.LRParser) \
  Typescript parser used to parse nodes inside `<script lang="ts">` tags. \
  Default: `typescriptLanguage.parser` from [`@codemirror/lang-javascript`](https://github.com/codemirror/lang-javascript/tree/main) \
  Useful for providing a parser with custom configs (e.g. overriding syntax highlighting)

- [`cssParser: LRParser`](https://lezer.codemirror.net/docs/ref/#lr.LRParser) \
  CSS parser used to parse nodes inside `<style>` tags. \
  Default: `cssLanguage.parser` from [`@codemirror/lang-css`](https://github.com/codemirror/lang-css/tree/main) \
  Useful for providing a parser with custom configs (e.g. overriding syntax highlighting)

The extension also exports `svelteLanguage` [`(LRLanguage)`](https://codemirror.net/docs/ref/#language.LRLanguage) and `svelteParser` [`(LRPraser)`](https://lezer.codemirror.net/docs/ref/#lr.LRParser) for advanced usage.

### Usage

```typescript
import { EditorState } from '@codemirror/state';
import { EditorView } from '@codemirror/view';
import { svelte } from 'codemirror-lang-svelte';
import { basicSetup } from 'codemirror';
import { javascriptLanguage } from '@codemirror/lang-javascript';
import { styleTags, tags } from '@lezer/highlight';

new EditorView({
  state: EditorState.create({
    doc: `<script>let a = "hello world";</script> <div>{a}</div>`,
    extensions: [
      basicSetup,
      svelte({
        jsParser: javascriptLanguage.parser.configure({
          props: [
            styleTags({
              'CallExpression/MemberExpression/PropertyName': tags.function(
                tags.variableName
              ),
            }),
          ],
        }),
      })
    ],
  }),
  parent: document.querySelector('#editor'),
});
```
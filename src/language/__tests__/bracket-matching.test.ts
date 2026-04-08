import { describe, it, expect } from 'vitest'
import { NodeProp } from '@lezer/common'
import { svelteLanguage } from '../svelte-language'

const parser = svelteLanguage({}).parser

// Walk the parse tree and collect, for each bracket character seen, the
// NodeProp.closedBy and NodeProp.openedBy values.  Since all nodes of the
// same token type share the same NodeType, one occurrence is enough.
function collectBracketProps(
  input: string,
): Map<string, { closedBy: readonly string[] | undefined; openedBy: readonly string[] | undefined }> {
  const tree = parser.parse(input)
  const cursor = tree.cursor()
  const result = new Map<
    string,
    { closedBy: readonly string[] | undefined; openedBy: readonly string[] | undefined }
  >()

  do {
    const name = cursor.type.name
    if (['{', '}', '(', ')', '[', ']'].includes(name) && !result.has(name)) {
      result.set(name, {
        closedBy: cursor.type.prop(NodeProp.closedBy),
        openedBy: cursor.type.prop(NodeProp.openedBy),
      })
    }
  } while (cursor.next())

  return result
}

// Regular interpolations like {expr} delegate to the nested JS parser, whose
// own bracket tokens are correct — they don't exercise the grammar's own
// paren/square-bracket token definitions.
//
// The grammar's own "(" and ")" tokens appear in:
//   - {#each list as item, (index)} — paren wrapping the index variable
//   - {#snippet name(param)}        — snippet parameter list
//
// The grammar's own "[" and "]" tokens appear in:
//   - {#each list as [a, b]}        — array destructuring pattern in each

const EACH_WITH_INDEX = `{#each items as item, (index)}{/each}`
const SNIPPET_WITH_PARAMS = `{#snippet mySnippet(param)}{/snippet}`
const EACH_WITH_ARRAY_DESTRUCTURE = `{#each items as [a, b]}{/each}`

describe('bracket NodeProp correctness', () => {
  describe('curly braces { }', () => {
    // Curly braces appear in every Svelte template expression.
    it('{ has closedBy="}"', () => {
      const props = collectBracketProps(EACH_WITH_INDEX)
      expect(props.get('{')?.closedBy).toEqual(['}'])
    })

    it('} has openedBy="{"', () => {
      const props = collectBracketProps(EACH_WITH_INDEX)
      expect(props.get('}')?.openedBy).toEqual(['{'])
    })
  })

  describe('parentheses ( )', () => {
    // BUG (lines 358-359 of syntax.grammar): "("[closedBy="("] and
    // ")"[openedBy=")"] point to themselves.  These two assertions will FAIL
    // until the grammar is corrected to closedBy=")" and openedBy="(".

    it('( has closedBy=")"', () => {
      const props = collectBracketProps(EACH_WITH_INDEX)
      expect(props.get('(')?.closedBy).toEqual([')'])
    })

    it(') has openedBy="("', () => {
      const props = collectBracketProps(EACH_WITH_INDEX)
      expect(props.get(')')?.openedBy).toEqual(['('])
    })

    it('same props hold in a snippet parameter list', () => {
      const props = collectBracketProps(SNIPPET_WITH_PARAMS)
      expect(props.get('(')?.closedBy).toEqual([')'])
      expect(props.get(')')?.openedBy).toEqual(['('])
    })
  })

  describe('square brackets [ ]', () => {
    it('[ has closedBy="]"', () => {
      const props = collectBracketProps(EACH_WITH_ARRAY_DESTRUCTURE)
      expect(props.get('[')?.closedBy).toEqual([']'])
    })

    it('] has openedBy="["', () => {
      const props = collectBracketProps(EACH_WITH_ARRAY_DESTRUCTURE)
      expect(props.get(']')?.openedBy).toEqual(['['])
    })
  })
})

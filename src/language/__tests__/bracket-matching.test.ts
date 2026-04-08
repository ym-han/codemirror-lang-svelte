import { describe, it, expect } from "vitest";
import { NodeProp } from "@lezer/common";
import { svelteLanguage } from "../svelte-language";

const parser = svelteLanguage({}).parser;

// Walk the parse tree and collect, for each bracket character seen, the
// NodeProp.closedBy and NodeProp.openedBy values.  Since all nodes of the
// same token type share the same NodeType, one occurrence is enough.
function collectBracketProps(input: string): Map<
  string,
  {
    closedBy: readonly string[] | undefined;
    openedBy: readonly string[] | undefined;
  }
> {
  const tree = parser.parse(input);
  const cursor = tree.cursor();
  const result = new Map<
    string,
    {
      closedBy: readonly string[] | undefined;
      openedBy: readonly string[] | undefined;
    }
  >();

  do {
    const name = cursor.type.name;
    if (["{", "}", "(", ")", "[", "]"].includes(name) && !result.has(name)) {
      result.set(name, {
        closedBy: cursor.type.prop(NodeProp.closedBy),
        openedBy: cursor.type.prop(NodeProp.openedBy),
      });
    }
  } while (cursor.next());

  return result;
}

// The grammar's own bracket tokens (as opposed to the nested JS parser's)
// appear in Svelte-specific template constructs:
//   "(" / ")" — {#each list as item, (index)}, {#snippet name(param)}
//   "[" / "]" — {#each list as [a, b]}
//   "{" / "}" — every block/interpolation delimiter

describe("bracket NodeProp correctness", () => {
  it("curly braces { } have correct closedBy/openedBy", () => {
    const props = collectBracketProps("{#each items as item, (index)}{/each}");
    expect(props.get("{")?.closedBy).toEqual(["}"]);
    expect(props.get("}")?.openedBy).toEqual(["{"]);
  });

  it("parentheses ( ) have correct closedBy/openedBy", () => {
    const props = collectBracketProps("{#each items as item, (index)}{/each}");
    expect(props.get("(")?.closedBy).toEqual([")"]);
    expect(props.get(")")?.openedBy).toEqual(["("]);
  });

  it("square brackets [ ] have correct closedBy/openedBy", () => {
    const props = collectBracketProps("{#each items as [a, b]}{/each}");
    expect(props.get("[")?.closedBy).toEqual(["]"]);
    expect(props.get("]")?.openedBy).toEqual(["["]);
  });
});

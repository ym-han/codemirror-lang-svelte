import { describe, it, expect } from "vitest";
import { svelteLanguage } from "../svelte-language";

const parser = svelteLanguage({}).parser;

function nodeNames(input: string): Set<string> {
  const tree = parser.parse(input);
  const names = new Set<string>();
  const cursor = tree.cursor();
  do {
    names.add(cursor.type.name);
  } while (cursor.next());
  return names;
}

function hasNoErrors(input: string): boolean {
  const tree = parser.parse(input);
  const cursor = tree.cursor();
  do {
    if (cursor.type.name === "⚠") return false;
  } while (cursor.next());
  return true;
}

// Find the first node with the given name and return its [from, to] span.
function findNodeSpan(input: string, nodeName: string): [number, number] | null {
  const tree = parser.parse(input);
  const cursor = tree.cursor();
  do {
    if (cursor.type.name === nodeName) return [cursor.from, cursor.to];
  } while (cursor.next());
  return null;
}

// -------------------------------------------------------------------
// Expression interpolations
// -------------------------------------------------------------------

describe("expression interpolation", () => {
  it("parses expressions of varying complexity", () => {
    for (const src of ["{someVar}", "{a + b}", "{obj.method(arg)}"]) {
      expect(nodeNames(src).has("Interpolation")).toBe(true);
      expect(hasNoErrors(src)).toBe(true);
    }
  });
});

// -------------------------------------------------------------------
// Block structure
// -------------------------------------------------------------------

describe("block structure parsing", () => {
  it("parses {#if}/{:else}/{/if}", () => {
    const src = "{#if cond}yes{:else}no{/if}";
    const names = nodeNames(src);
    expect(names.has("IfBlock")).toBe(true);
    expect(names.has("ElseBlock")).toBe(true);
    expect(hasNoErrors(src)).toBe(true);
  });

  it("parses {#each}/{/each}", () => {
    const src = "{#each items as item}text{/each}";
    expect(nodeNames(src).has("EachBlock")).toBe(true);
    expect(hasNoErrors(src)).toBe(true);
  });

  it("parses {#await} with inline then", () => {
    const src = "{#await promise then value}text{/await}";
    expect(nodeNames(src).has("AwaitBlock")).toBe(true);
    expect(hasNoErrors(src)).toBe(true);
  });

  it("parses {#key}/{/key}", () => {
    const src = "{#key expr}text{/key}";
    expect(nodeNames(src).has("KeyBlock")).toBe(true);
    expect(hasNoErrors(src)).toBe(true);
  });

  it("parses {#snippet}/{/snippet}", () => {
    const src = "{#snippet mySnippet(param)}text{/snippet}";
    expect(nodeNames(src).has("SnippetBlock")).toBe(true);
    expect(hasNoErrors(src)).toBe(true);
  });
});

// -------------------------------------------------------------------
// Svelte special elements
// -------------------------------------------------------------------

describe("svelte special elements", () => {
  it.each([
    "<svelte:window />",
    "<svelte:head>title</svelte:head>",
    "<svelte:boundary>content</svelte:boundary>",
  ])("parses %s", (src) => {
    expect(nodeNames(src).has("SvelteElementName")).toBe(true);
    expect(hasNoErrors(src)).toBe(true);
  });
});

// -------------------------------------------------------------------
// Bracket-tracking in expression tokenizer (tokens.ts)
// -------------------------------------------------------------------

describe("bracket-tracking in expression tokenizer", () => {
  it("tracks parens so > in arrow function does not terminate expression", () => {
    const src = "{items.filter((x) => x > 0)}";
    expect(hasNoErrors(src)).toBe(true);
    const span = findNodeSpan(src, "Interpolation");
    expect(span).toEqual([0, src.length]);
  });

  it("tracks square brackets in computed property access", () => {
    const src = "{obj[key]}";
    expect(hasNoErrors(src)).toBe(true);
    const span = findNodeSpan(src, "Interpolation");
    expect(span).toEqual([0, src.length]);
  });

  it("tracks nested curly braces in object literal", () => {
    const src = "{fn({a: 1})}";
    expect(hasNoErrors(src)).toBe(true);
    const span = findNodeSpan(src, "Interpolation");
    expect(span).toEqual([0, src.length]);
  });

  it("does not terminate on } inside a string", () => {
    const src = '{fn("}")}';
    expect(hasNoErrors(src)).toBe(true);
    const span = findNodeSpan(src, "Interpolation");
    expect(span).toEqual([0, src.length]);
  });

  it("does not terminate on } inside a single-quoted string", () => {
    const src = "{fn('}')}";
    expect(hasNoErrors(src)).toBe(true);
    const span = findNodeSpan(src, "Interpolation");
    expect(span).toEqual([0, src.length]);
  });
});

// -------------------------------------------------------------------
// asTerminatedLongExpression — used in {#each expr as item}
// -------------------------------------------------------------------

describe("as-terminated expression tokenizer", () => {
  it("does not terminate on 'as' inside parentheses", () => {
    const src = "{#each items.filter(x => x.as > 0) as item}text{/each}";
    expect(nodeNames(src).has("EachBlock")).toBe(true);
    expect(hasNoErrors(src)).toBe(true);
  });
});

// -------------------------------------------------------------------
// HTML elements — exercises html-tokens.ts
// -------------------------------------------------------------------

describe("HTML element parsing", () => {
  it("parses nested elements", () => {
    const src = "<div><span>text</span></div>";
    expect(nodeNames(src).has("Element")).toBe(true);
    expect(hasNoErrors(src)).toBe(true);
  });

  it("parses self-closing void elements", () => {
    expect(nodeNames('<input type="text" />').has("Element")).toBe(true);
    expect(nodeNames("<br />").has("Element")).toBe(true);
  });
});

// -------------------------------------------------------------------
// Directives
// -------------------------------------------------------------------

describe("directive parsing", () => {
  it("parses on:, bind:, class: directives", () => {
    const src = "<input on:click={handler} bind:value={val} class:active={isActive} />";
    const names = nodeNames(src);
    expect(names.has("DirectiveOn")).toBe(true);
    expect(names.has("DirectiveBind")).toBe(true);
    expect(names.has("DirectiveClass")).toBe(true);
    expect(hasNoErrors(src)).toBe(true);
  });
});

// -------------------------------------------------------------------
// Script and style tags
// -------------------------------------------------------------------

describe("script and style tag parsing", () => {
  it("parses <script> producing ScriptText", () => {
    expect(nodeNames("<script>let x = 1;</script>").has("ScriptText")).toBe(true);
  });

  it("parses <style> producing StyleText", () => {
    expect(nodeNames("<style>div { color: red; }</style>").has("StyleText")).toBe(true);
  });
});

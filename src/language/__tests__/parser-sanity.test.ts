import { describe, it, expect } from "vitest";
import { svelteLanguage } from "../svelte-language";

const parser = svelteLanguage({}).parser;

// Collect the names of all nodes in the parse tree.
function nodeNames(input: string): Set<string> {
  const tree = parser.parse(input);
  const names = new Set<string>();
  const cursor = tree.cursor();
  do {
    names.add(cursor.type.name);
  } while (cursor.next());
  return names;
}

// Return true if the parse tree contains no error nodes ("⚠" is Lezer's error node).
function hasNoErrors(input: string): boolean {
  const tree = parser.parse(input);
  const cursor = tree.cursor();
  do {
    if (cursor.type.name === "⚠") return false;
  } while (cursor.next());
  return true;
}

// -------------------------------------------------------------------
// 1. Expression interpolations
// -------------------------------------------------------------------

describe("expression interpolation", () => {
  it("parses a simple variable reference", () => {
    const names = nodeNames("{someVar}");
    expect(names.has("Interpolation")).toBe(true);
    expect(hasNoErrors("{someVar}")).toBe(true);
  });

  it("parses a binary expression", () => {
    expect(hasNoErrors("{a + b}")).toBe(true);
    expect(nodeNames("{a + b}").has("Interpolation")).toBe(true);
  });

  it("parses a method call with an argument", () => {
    expect(hasNoErrors("{obj.method(arg)}")).toBe(true);
    expect(nodeNames("{obj.method(arg)}").has("Interpolation")).toBe(true);
  });
});

// -------------------------------------------------------------------
// 2. Block structure
// -------------------------------------------------------------------

describe("block structure parsing", () => {
  it("parses {#if}{/if}", () => {
    const src = "{#if cond}text{/if}";
    expect(nodeNames(src).has("IfBlock")).toBe(true);
    expect(hasNoErrors(src)).toBe(true);
  });

  it("parses {#if}{:else}{/if}", () => {
    const src = "{#if cond}yes{:else}no{/if}";
    const names = nodeNames(src);
    expect(names.has("IfBlock")).toBe(true);
    expect(names.has("ElseBlock")).toBe(true);
    expect(hasNoErrors(src)).toBe(true);
  });

  it("parses {#each}{/each}", () => {
    const src = "{#each items as item}text{/each}";
    expect(nodeNames(src).has("EachBlock")).toBe(true);
    expect(hasNoErrors(src)).toBe(true);
  });

  it("parses {#await}{/await} with inline then", () => {
    const src = "{#await promise then value}text{/await}";
    expect(nodeNames(src).has("AwaitBlock")).toBe(true);
    expect(hasNoErrors(src)).toBe(true);
  });

  it("parses {#key}{/key}", () => {
    const src = "{#key expr}text{/key}";
    expect(nodeNames(src).has("KeyBlock")).toBe(true);
    expect(hasNoErrors(src)).toBe(true);
  });

  it("parses {#snippet name(param)}{/snippet}", () => {
    const src = "{#snippet mySnippet(param)}text{/snippet}";
    expect(nodeNames(src).has("SnippetBlock")).toBe(true);
    expect(hasNoErrors(src)).toBe(true);
  });
});

// -------------------------------------------------------------------
// 3. Svelte special elements
// -------------------------------------------------------------------

describe("svelte special elements", () => {
  it("parses <svelte:window />", () => {
    const src = "<svelte:window />";
    expect(nodeNames(src).has("SvelteElementName")).toBe(true);
    expect(hasNoErrors(src)).toBe(true);
  });

  it("parses <svelte:head>", () => {
    const src = "<svelte:head>title</svelte:head>";
    expect(nodeNames(src).has("SvelteElementName")).toBe(true);
    expect(hasNoErrors(src)).toBe(true);
  });

  it("parses <svelte:boundary>", () => {
    const src = "<svelte:boundary>content</svelte:boundary>";
    expect(nodeNames(src).has("SvelteElementName")).toBe(true);
    expect(hasNoErrors(src)).toBe(true);
  });
});

// -------------------------------------------------------------------
// 4. Nested bracket expressions — exercises the bracket-tracking tokenizer
// -------------------------------------------------------------------

describe("bracket-tracking in expression tokenizer", () => {
  it("parses a filter with an arrow function without error nodes", () => {
    // The tokenizer must track the outer () so the ">" in the arrow function
    // does not terminate the expression prematurely.
    expect(hasNoErrors("{items.filter((x) => x > 0)}")).toBe(true);
  });

  it("parses a computed property access without error nodes", () => {
    expect(hasNoErrors("{obj[key]}")).toBe(true);
  });

  it("parses nested curly braces (object literal) without error nodes", () => {
    expect(hasNoErrors("{fn({a: 1})}")).toBe(true);
  });
});

// -------------------------------------------------------------------
// 5. HTML elements — exercises html-tokens.ts
// -------------------------------------------------------------------

describe("HTML element parsing", () => {
  it("parses a nested element structure", () => {
    const src = "<div><span>text</span></div>";
    const names = nodeNames(src);
    expect(names.has("Element")).toBe(true);
    expect(hasNoErrors(src)).toBe(true);
  });

  it("parses a self-closing element", () => {
    const src = '<input type="text" />';
    expect(nodeNames(src).has("Element")).toBe(true);
    expect(hasNoErrors(src)).toBe(true);
  });
});

// -------------------------------------------------------------------
// 6. Directives
// -------------------------------------------------------------------

describe("directive parsing", () => {
  it("parses on: directive", () => {
    const src = "<button on:click={handler}>click</button>";
    const names = nodeNames(src);
    // The grammar generates DirectiveOn via dr<"On", "on">
    expect(names.has("DirectiveOn")).toBe(true);
    expect(hasNoErrors(src)).toBe(true);
  });

  it("parses bind: directive", () => {
    const src = "<input bind:value={val} />";
    const names = nodeNames(src);
    expect(names.has("DirectiveBind")).toBe(true);
    expect(hasNoErrors(src)).toBe(true);
  });

  it("parses class: directive", () => {
    const src = "<div class:active={isActive}></div>";
    const names = nodeNames(src);
    expect(names.has("DirectiveClass")).toBe(true);
    expect(hasNoErrors(src)).toBe(true);
  });

  it("parses multiple directives on one element without errors", () => {
    const src = "<input on:click={handler} bind:value={val} class:active={isActive} />";
    expect(hasNoErrors(src)).toBe(true);
  });
});

// -------------------------------------------------------------------
// 7. Script and style tags
// -------------------------------------------------------------------

describe("script and style tag parsing", () => {
  it("parses a <script> tag and produces a ScriptText node", () => {
    const src = "<script>let x = 1;</script>";
    expect(nodeNames(src).has("ScriptText")).toBe(true);
    expect(hasNoErrors(src)).toBe(true);
  });

  it("parses a <style> tag and produces a StyleText node", () => {
    const src = "<style>div { color: red; }</style>";
    expect(nodeNames(src).has("StyleText")).toBe(true);
    expect(hasNoErrors(src)).toBe(true);
  });
});

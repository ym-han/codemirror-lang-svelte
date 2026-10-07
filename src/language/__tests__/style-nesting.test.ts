import { describe, it, expect } from "vitest";
import { NodeProp, type Tree } from "@lezer/common";
import { highlightTree, tagHighlighter, tags } from "@lezer/highlight";
import { svelteLanguage } from "../svelte-language";

const parser = svelteLanguage({}).parser;

const propertyNameClass = "property-name";
const highlighter = tagHighlighter([{ tag: tags.propertyName, class: propertyNameClass }]);

// Text of every range inside the <style> body highlighted as a property name.
// The opening tag is skipped because Svelte tags attribute names the same way.
function propertyNames(input: string): string[] {
  const bodyStart = input.indexOf(">") + 1;
  const names: string[] = [];
  highlightTree(parser.parse(input), highlighter, (from, to, classes) => {
    if (from >= bodyStart && classes.includes(propertyNameClass)) {
      names.push(input.slice(from, to));
    }
  });
  return names;
}

// Node names of the tree plus every tree mounted into it. The nested CSS is an
// overlay mount, which plain cursor iteration does not descend into.
function nodeNames(input: string): Set<string> {
  const names = new Set<string>();
  const collect = (tree: Tree) =>
    tree.iterate({
      enter(node) {
        names.add(node.name);
        const mounted = node.tree?.prop(NodeProp.mounted);
        if (mounted) collect(mounted.tree);
      },
    });
  collect(parser.parse(input));
  return names;
}

const body = ".a { @apply text-sm; color: red; }";

describe("<style> CSS nesting", () => {
  it.each([
    ["no lang", "<style>"],
    ['lang="css"', '<style lang="css">'],
    ['lang="postcss"', '<style lang="postcss">'],
    ['lang="pcss"', '<style lang="pcss">'],
    ['lang="scss"', '<style lang="scss">'],
    ['lang="less"', '<style lang="less">'],
  ])("nests CSS for %s", (_label, open) => {
    const src = `${open}${body}</style>`;
    const names = nodeNames(src);
    expect(names.has("RuleSet")).toBe(true);
    expect(names.has("AtKeyword")).toBe(true);
    expect(propertyNames(src)).toEqual(["color"]);
  });

  it("does not nest CSS for indented sass", () => {
    const src = '<style lang="sass">.a\n  color: red\n</style>';
    expect(nodeNames(src).has("RuleSet")).toBe(false);
    expect(propertyNames(src)).toEqual([]);
  });

  it("leaves the surrounding script and markup parsed, with the script nested as JS", () => {
    const src = `<script>let x = 1;</script>\n<div>{x}</div>\n<style lang="postcss">${body}</style>`;
    const names = nodeNames(src);
    expect(names.has("VariableDeclaration")).toBe(true);
    expect(names.has("Element")).toBe(true);
    expect(names.has("Interpolation")).toBe(true);
    expect(names.has("RuleSet")).toBe(true);
    expect(names.has("⚠")).toBe(false);
  });
});

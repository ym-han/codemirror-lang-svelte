import { parser as svelteParser } from './language/syntax.grammar';
import { LanguageSupport } from '@codemirror/language';
import { svelteLanguage, Config } from './language/svelte-language';
export type { Config };
export { svelteParser, svelteLanguage };
export declare function svelte(config?: Config): LanguageSupport;

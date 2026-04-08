import { LanguageSupport } from '@codemirror/language';
import { LRLanguage } from '@codemirror/language';
import { LRParser } from '@lezer/lr';

export declare interface Config {
    jsParser?: LRParser;
    tsParser?: LRParser;
    cssParser?: LRParser;
}

export declare function svelte(config?: Config): LanguageSupport;

export declare function svelteLanguage(config: Config): LRLanguage;

export declare const svelteParser: LRParser;

export { }

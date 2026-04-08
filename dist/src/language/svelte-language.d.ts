import { LRLanguage } from '@codemirror/language';
import { LRParser } from '@lezer/lr';
export interface Config {
    jsParser?: LRParser;
    tsParser?: LRParser;
    cssParser?: LRParser;
}
export declare function svelteLanguage(config: Config): LRLanguage;

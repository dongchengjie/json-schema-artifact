"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const translate = (text, localeDict) => {
    // find all translations
    const translations = rawTranslations(text).map(translation => ({
        ...translation,
        replacement: localeDict.get(translation.key) ?? translation.original,
    }));
    // replace key with locale value
    translations.forEach(translation => {
        text = text.replace(translation.original, translation.replacement);
    });
    return text;
};
// parse raw translations
const rawTranslations = (input) => {
    const regex = /t\(`(.*?)`\)/gm;
    return (input.match(regex) ?? []).map((original) => {
        const key = original.replace(regex, "$1");
        const replacement = original; // original is equal to replacement by default
        return { original, key, replacement };
    });
};
exports.default = translate;

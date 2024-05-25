type Translation = {
  original: string;
  key: string;
  replacement: string;
};

const translate = (text: string, localeDict: Map<string, string>): string => {
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
const rawTranslations = (input: string): Translation[] => {
  const regex = /t\(`(.*?)`\)/gm;
  return (input.match(regex) ?? []).map((original: string) => {
    const key = original.replace(regex, "$1");
    const replacement = original; // original is equal to replacement by default
    return { original, key, replacement };
  });
};

export default translate;

import { consola } from "consola";
import { cosmiconfig } from "cosmiconfig";
import fs from "fs-extra";
import path from "node:path";

type Translation = {
  original: string;
  key: string;
  replacement: string;
};

export const localize = async (text: string, localeFile: string) => {
  const filepath = path.resolve(localeFile);
  if (fs.existsSync(filepath)) {
    try {
      const explorer = cosmiconfig(localeFile, {
        searchPlaces: [filepath],
        cache: false
      });
      const dict = await explorer.load(filepath);
      if (!dict) return text;

      return translate(text, dict.config, filepath);
    } catch (error: any) {
      consola.error(`Error localizing from ${filepath}:`, error);
    }
  } else {
    consola.error("Locale file does not exist:", filepath);
  }
};

const translate = (text: string, dict: Record<string, string>, filepath: string): string => {
  const translations = parseTranslations(text).map(translation => {
    if (!dict[translation.key]) {
      consola.warn(`Missing translation for key "${translation.key}" in ${filepath}`);
      return translation;
    } else {
      return {
        ...translation,
        replacement: dict[translation.key]
      };
    }
  });

  for (const translation of translations) {
    text = text.replace(translation.original, translation.replacement);
  }

  return text;
};

const parseTranslations = (input: string): Translation[] => {
  const regex = /t\(`(.*?)`\)/gm;
  return (input.match(regex) ?? []).map((original: string) => {
    const key = original.replace(regex, "$1");
    const replacement = key; // fallback to key if no translation is found
    return { original, key, replacement };
  });
};

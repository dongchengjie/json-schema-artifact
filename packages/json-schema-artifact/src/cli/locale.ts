import { consola } from "consola";
import { cosmiconfig } from "cosmiconfig";
import fs from "fs-extra";
import { JSONPath } from "jsonpath-plus";
import { merge } from "lodash-es";

type Translation = {
  original: string;
  key: string;
  replacement: string;
};

export const localize = async (text: string, localeFiles: string[]) => {
  try {
    const locales = await Promise.all(localeFiles.map(loadLocale));
    const dicts = locales.filter(dict => dict !== undefined);
    if (dicts.length === 0) return text;

    const dict = merge({}, ...dicts);
    return translate(text, dict, localeFiles);
  } catch (error: any) {
    consola.error(`Error localizing from ${localeFiles}:`, error);
  }
};

export const loadLocale = async (
  localeFile: string
): Promise<Record<string, string> | undefined> => {
  if (fs.existsSync(localeFile)) {
    try {
      const explorer = cosmiconfig(localeFile, {
        searchPlaces: [localeFile],
        cache: false
      });
      const result = await explorer.load(localeFile);
      return result?.config;
    } catch (error: any) {
      consola.error(`Error loading locale from ${localeFile}:`, error);
    }
  } else {
    consola.error("Locale file does not exist:", localeFile);
  }
};

const translate = (text: string, dict: Record<string, string>, filepaths: string[]): string => {
  const translations = parseTranslationKeys(text).map(candidate => {
    const replacement = JSONPath({
      path: candidate.key,
      json: dict,
      wrap: false,
      ignoreEvalErrors: true
    });

    if (!replacement) {
      consola.warn(`Missing translation for key "${candidate.key}" in ${filepaths}`);
      return candidate;
    } else {
      return { ...candidate, replacement };
    }
  });

  // Replace original text with translations
  for (const translation of translations) {
    text = text.replace(translation.original, translation.replacement);
  }

  return text;
};

const parseTranslationKeys = (input: string): Translation[] => {
  const regex = /t\(`(.*?)`\)/gm;
  return (input.match(regex) ?? []).map((original: string) => {
    const key = original.replace(regex, "$1");
    const replacement = key; // fallback to key if no translation is found
    return { original, key, replacement };
  });
};

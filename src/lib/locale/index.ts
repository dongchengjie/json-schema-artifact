import fs from "fs-extra";
import path from "path";
import translate from "./translate";

/**
 * translate file using locale file
 * @param input inpit file
 * @param code locale code
 * @param locale locale file
 */
const localize = (input: string, code: string, locale: string) => {
  if (fs.existsSync(input) && fs.existsSync(locale)) {
    try {
      // read input and locale file
      const text = fs.readFileSync(input, "utf-8");
      const localeDict = new Map<string, string>(Object.entries(JSON.parse(fs.readFileSync(locale, "utf-8"))));

      // do localization
      const translated = translate(text, localeDict);

      // write result to file
      const output = input.replace(path.extname(input), `-${code}${path.extname(input)}`);
      fs.ensureFileSync(output);
      fs.writeFileSync(output, translated);
    } catch (error) {
      console.error(`Error localizing ${input} with ${locale}: ${error}`);
    }
  }
};

export default localize;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const translate_1 = __importDefault(require("./translate"));
/**
 * translate file using locale file
 * @param input inpit file
 * @param code locale code
 * @param locale locale file
 */
const localize = (input, code, locale) => {
    if (fs_extra_1.default.existsSync(input) && fs_extra_1.default.existsSync(locale)) {
        try {
            // read input and locale file
            const text = fs_extra_1.default.readFileSync(input, "utf-8");
            const localeDict = new Map(Object.entries(JSON.parse(fs_extra_1.default.readFileSync(locale, "utf-8"))));
            // do localization
            const translated = (0, translate_1.default)(text, localeDict);
            // write result to file
            const output = input.replace(path_1.default.extname(input), `-${code}${path_1.default.extname(input)}`);
            fs_extra_1.default.ensureFileSync(output);
            fs_extra_1.default.writeFileSync(output, translated);
        }
        catch (error) {
            console.error(`Error localizing ${input} with ${locale}: ${error}`);
        }
    }
};
exports.default = localize;

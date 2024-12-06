"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prettier_1 = __importDefault(require("prettier"));
/**
 * format the content using prettier
 * @param content content to format
 * @returns formatted content
 */
const format = async (content) => {
    const options = {
        parser: "json",
        printWidth: 100,
        tabWidth: 2,
        useTabs: false,
        trailingComma: "none",
        endOfLine: "lf"
    };
    return await prettier_1.default.format(content, options).then(formatted => formatted);
};
exports.default = format;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = __importDefault(require("fs-extra"));
const prettier_1 = __importDefault(require("prettier"));
/**
 * format the content using prettier
 * @param content content to format
 * @param parser parser to use
 * @returns formatted content
 */
const format = async (content, parser) => {
    const options = { parser, ...JSON.parse(fs_extra_1.default.readFileSync(".prettierrc", "utf-8")) };
    return await prettier_1.default.format(content, options).then(formatted => formatted);
};
exports.default = format;

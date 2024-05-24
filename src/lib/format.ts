import fs from "fs-extra";
import prettier from "prettier";

/**
 * format the content using prettier
 * @param content content to format
 * @param parser parser to use
 * @returns formatted content
 */
const format = async (content: string, parser: string) => {
  const options = { parser, ...JSON.parse(fs.readFileSync(".prettierrc", "utf-8")) };
  return await prettier.format(content, options).then(formatted => formatted);
};

export default format;

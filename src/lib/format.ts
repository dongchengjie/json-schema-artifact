import prettier, { type Options } from "prettier";

/**
 * format the content using prettier
 * @param content content to format
 * @returns formatted content
 */
const format = async (content: string) => {
  const options: Options = {
    parser: "json",
    printWidth: 100,
    tabWidth: 2,
    useTabs: false,
    trailingComma: "none",
    endOfLine: "lf"
  };
  return await prettier.format(content, options).then(formatted => formatted);
};

export default format;

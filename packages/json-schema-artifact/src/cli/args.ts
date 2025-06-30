import { program } from "commander";

// import cac from "cac";

export type Args = {
  /**
   * Path to the configuration file
   * @default "json-schema-artifact.json"
   */
  config: string;

  /**
   * Enable watch mode
   * @default false
   */
  watch: boolean;
};

export const parseArgs = (): Args => {
  return program
    .option("-c, --config <path>", "path to the configuration file")
    .option("-w, --watch", "enable watch mode", false)
    .parse()
    .opts();
};

type ArtifactOptions = {
  /**
   * Input options.
   */
  input: string | InputOptions;

  /**
   * Output options.
   */
  output: OutputOptions;

  /**
   * Watch mode configuration.
   * - `true`: Watch the input file for changes.
   * - `string`: Watch files matching the provided glob pattern for changes.
   * - `string[]`: Watch files matching the provided glob patterns for changes.
   */
  watch?: boolean | string | string[];
};

type InputOptions = {
  /**
   * Path to the input file.
   */
  file: string;

  /**
   * Locale file(s) to use for localization.
   */
  locales?: { [localeCode: string]: string | string[] };
};

type OutputOptions = {
  /**
   * Output directory for the outputs.
   * @default "dist"
   */
  dir?: string;

  /**
   * Output path for the output.
   */
  file?: string;

  /**
   * Optimization options for the output.
   */
  optimize?: OptimizeOptions;
};

type OptimizeOptions = {
  /**
   * Whether to minify the output.
   * @default false
   */
  minify?: boolean;

  /**
   * Dereferencing strategy to use for the output.
   * - "none":    No dereferencing.
   * - "flatten": Dereferencing indirect references.
   * - "plain":   Dereferencing all references.
   * @default "flatten"
   */
  dereference?: "none" | "flatten" | "plain";
};

export type ArtifactConfig = ArtifactOptions | ArtifactOptions[];

export declare const defineConfig: (config: ArtifactConfig) => ArtifactConfig;

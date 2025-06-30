type ArtifactOptions = {
  input: string | InputOptions;
  output: OutputOptions;
  watch?: boolean | string | string[];
};

type InputOptions = {
  file: string;
  locales?: { [localeCode: string]: string | string[] };
};

type OutputOptions = {
  dir?: string;
  file?: string;
  optimize?: OptimizeOptions;
};

type OptimizeOptions = {
  minify?: boolean;
  dereference?: "none" | "flatten" | "plain";
};

export type ArtifactConfig = ArtifactOptions | ArtifactOptions[];

export declare const defineConfig: (config: ArtifactConfig) => ArtifactConfig;

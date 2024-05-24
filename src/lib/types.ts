export type Args = {
  watch: (WatchDirectory | WatchFile)[]; // directories or files to watch
  build: {
    target: Target[]; // target to build
    optimize?: Optimize; // optimization options
  };
};

export type WatchDirectory = {
  dir: string; // directory to watch
  recursive?: boolean; // recursively watch subdirectories
};

export type WatchFile = {
  file: string; // file to watch
};

export type Target = {
  input: string; // JSON Schema input
  output: string; // JSON Schema output
};

export type Optimize = {
  refsDerefer?: boolean; // indirect refs dereference
  format: "minify" | "pretty"; // output format
};

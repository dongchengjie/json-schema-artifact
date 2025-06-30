import { consola } from "consola";
import { parseArgs } from "./args";
import { Bundler } from "./bundler";
import { buildBundleOptions, loadConfig } from "./config";

(async () => {
  // Parse command line arguments
  const args = parseArgs();

  // Load options from configuration file
  const config = await loadConfig(args.config);
  const options = buildBundleOptions(config);

  // Create bundlers
  const bundlers = options.map(option => new Bundler(option));
  for (const bundler of bundlers) {
    try {
      await bundler.bundle(args.watch);
      consola.success(`Bundled ${bundler.options.input} to ${bundler.options.output}`);
    } catch (error) {
      console.error(`Error bundling ${bundler.options.input}:`, error);
    }
  }
})();

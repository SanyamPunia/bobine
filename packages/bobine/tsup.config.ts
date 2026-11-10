import { copyFileSync } from "node:fs"
import path from "node:path"
import { defineConfig, type Options } from "tsup"

// The package compiles the same files the registry ships, so there is one source of truth.
const root = path.resolve(__dirname, "../..")

const shared: Options = {
  format: ["esm"],
  target: "es2022",
  dts: true,
  sourcemap: true,
  treeshake: true,
  tsconfig: path.join(__dirname, "tsconfig.json"),
  external: ["react", "react-dom", "hls.js", "clsx", "tailwind-merge"],
  esbuildOptions(options) {
    options.alias = { "@": root }
  },
  /* swaps in the package's own cn, so the site's type scale stays out */
  esbuildPlugins: [
    {
      name: "package-utils",
      setup(build) {
        build.onResolve({ filter: /^@\/lib\/utils$/ }, () => ({ path: path.join(__dirname, "src/utils.ts") }))
      },
    },
  ],
}

export default defineConfig([
  {
    ...shared,
    entry: {
      core: path.join(root, "lib/media-store.ts"),
      hls: path.join(root, "lib/media-hls.ts"),
    },
  },
  {
    ...shared,
    entry: { index: path.join(__dirname, "src/index.ts") },
    // Rollup tree-shaking strips module directives, which would drop "use client".
    treeshake: false,
    banner: { js: '"use client";' },
    onSuccess: async () => {
      copyFileSync(path.join(__dirname, "src/styles.css"), path.join(__dirname, "dist/styles.css"))
    },
  },
])

import { build } from "esbuild";

build({
  entryPoints: ["src/index.ts"],
  bundle: true,
  platform: "node",
  target: "node18",
  outfile: "dist/server.min.js",
  sourcemap: true,
  minify: false
}).catch((err) => {
  console.log(err);
  process.exit(1);
});

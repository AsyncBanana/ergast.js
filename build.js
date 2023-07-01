import { build } from "esbuild";
import { globbySync } from "globby";
await build({
	entryPoints: globbySync("src"),
	bundle: false,
	outdir: "dist",
});

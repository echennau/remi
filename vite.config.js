import { defineConfig } from "vite";
import { exec } from "child_process";
import { promisify } from "util";
import path from "path";

const execAsync = promisify(exec);

export default defineConfig({
  root: "showcase",
  base: "./",
  resolve: {
    alias: {
      "@tokens": path.resolve("dist/tokens/tokens.json"),
    },
  },
  build: {
    // output directory for gh pages
    outDir: "../_site",
    emptyOutDir: true,
  },
  server: {
    open: true,
    strictPort: true,
    fs: { allow: [".."] },
  },
  plugins: [
    // custom plugin to rebuild when any tokens or styles change
    {
      name: "watch-src",
      configureServer(server) {
        const srcDir = path.resolve("src");
        server.watcher.add(srcDir);
        let buildPending = false;
        server.watcher.on("change", async (file) => {
          if (!file.startsWith(srcDir) || buildPending) return;
          buildPending = true;
          try {
            await execAsync(
              "node build.js && cp -r ./src/styles ./dist && cp -r ./src/fonts ./dist",
            );
            server.ws.send({ type: "full-reload" });
          } catch (e) {
            console.error("[remi] build.js failed:", e.stderr);
          } finally {
            buildPending = false;
          }
        });
      },
    },
  ],
});

// vite.config.ts
import fs from "node:fs";

// package.json
var package_default = {
  name: "electron-vue",
  version: "24.1204.1552",
  description: "Really simple Electron + Vue + Vite boilerplate.",
  author: {
    name: "rirh<i@tigerzh.com>"
  },
  private: true,
  type: "module",
  main: "dist-electron/main/index.js",
  scripts: {
    dev: "vite",
    build: 'run-p type-check "build-only {@}" --',
    preview: "vite preview",
    "build-only": "vite build",
    "type-check": "vue-tsc --build --force",
    "lint:oxlint": "oxlint . --fix -D correctness --ignore-path .gitignore",
    "lint:eslint": "eslint . --fix",
    lint: "run-s lint:*",
    format: "prettier --write src/",
    "build:app": "npm run build && electron-builder"
  },
  dependencies: {},
  devDependencies: {
    "@tailwindcss/vite": "^4.0.0-beta.4",
    "@tanstack/vue-query": "^5.62.2",
    "@tsconfig/node22": "^22.0.0",
    "@types/js-cookie": "^3.0.6",
    "@types/node": "^22.9.0",
    "@vitejs/plugin-vue": "^5.1.4",
    "@vue/eslint-config-prettier": "^10.1.0",
    "@vue/eslint-config-typescript": "^14.1.3",
    "@vue/tsconfig": "^0.5.1",
    autoprefixer: "^10.4.20",
    electron: "^33.2.1",
    "electron-builder": "^25.1.8",
    "element-plus": "^2.8.8",
    eslint: "^9.14.0",
    "eslint-plugin-oxlint": "^0.11.0",
    "eslint-plugin-vue": "^9.30.0",
    "js-cookie": "^3.0.5",
    "npm-run-all2": "^7.0.1",
    oxlint: "^0.11.0",
    pinia: "^2.2.6",
    postcss: "^8.4.49",
    prettier: "^3.3.3",
    tailwindcss: "^4.0.0-beta.4",
    typescript: "~5.6.3",
    "unplugin-auto-import": "^0.18.5",
    "unplugin-vue-components": "^0.27.4",
    vite: "^5.4.10",
    "vite-plugin-electron": "^0.29.0",
    "vite-plugin-electron-renderer": "^0.14.6",
    "vite-plugin-vue-devtools": "^7.5.4",
    vue: "^3.5.12",
    "vue-router": "^4.4.5",
    "vue-tsc": "^2.1.10"
  }
};

// vite.config.ts
import vue from "file:///Users/zh/Documents/playground/vue-template-1/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import { dayjs } from "file:///Users/zh/Documents/playground/vue-template-1/node_modules/element-plus/es/index.mjs";
import { fileURLToPath, URL } from "node:url";
import { defineConfig, loadEnv } from "file:///Users/zh/Documents/playground/vue-template-1/node_modules/vite/dist/node/index.js";
import tailwindcss from "file:///Users/zh/Documents/playground/vue-template-1/node_modules/@tailwindcss/vite/dist/index.mjs";
import electron from "file:///Users/zh/Documents/playground/vue-template-1/node_modules/vite-plugin-electron/dist/simple.mjs";
import vueDevTools from "file:///Users/zh/Documents/playground/vue-template-1/node_modules/vite-plugin-vue-devtools/dist/vite.mjs";
import AutoImport from "file:///Users/zh/Documents/playground/vue-template-1/node_modules/unplugin-auto-import/dist/vite.js";
import Components from "file:///Users/zh/Documents/playground/vue-template-1/node_modules/unplugin-vue-components/dist/vite.js";
import { ElementPlusResolver } from "file:///Users/zh/Documents/playground/vue-template-1/node_modules/unplugin-vue-components/dist/resolvers.js";
var __vite_injected_original_import_meta_url = "file:///Users/zh/Documents/playground/vue-template-1/vite.config.ts";
var vite_config_default = defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd());
  fs.rmSync("dist-electron", { recursive: true, force: true });
  const isServe = command === "serve";
  const isBuild = command === "build";
  const sourcemap = isServe || !!process.env.VSCODE_DEBUG;
  process.env.VITE_APP_BUILD_TIME = dayjs().format("YYYY-MM-DD HH:mm:ss");
  return {
    base: env.VITE_APP_BASE_URL,
    plugins: [
      vue(),
      vueDevTools(),
      AutoImport({
        resolvers: [ElementPlusResolver()]
      }),
      Components({
        resolvers: [ElementPlusResolver()]
      }),
      tailwindcss(),
      electron({
        main: {
          // Shortcut of `build.lib.entry`
          entry: "electron/main/index.ts",
          onstart({ startup }) {
            if (process.env.VSCODE_DEBUG) {
              console.log(
                /* For `.vscode/.debug.script.mjs` */
                "[startup] Electron App"
              );
            } else {
              startup();
            }
          },
          vite: {
            build: {
              sourcemap,
              minify: isBuild,
              outDir: "dist-electron/main",
              rollupOptions: {
                // Some third-party Node.js libraries may not be built correctly by Vite, especially `C/C++` addons, 
                // we can use `external` to exclude them to ensure they work correctly.
                // Others need to put them in `dependencies` to ensure they are collected into `app.asar` after the app is built.
                // Of course, this is not absolute, just this way is relatively simple. :)
                external: Object.keys("dependencies" in package_default ? package_default.dependencies : {})
              }
            }
          }
        },
        preload: {
          // Shortcut of `build.rollupOptions.input`.
          // Preload scripts may contain Web assets, so use the `build.rollupOptions.input` instead `build.lib.entry`.
          input: "electron/preload/index.ts",
          vite: {
            build: {
              sourcemap: sourcemap ? "inline" : void 0,
              // #332
              minify: isBuild,
              outDir: "dist-electron/preload",
              rollupOptions: {
                external: Object.keys("dependencies" in package_default ? package_default.dependencies : {})
              }
            }
          }
        },
        // Ployfill the Electron and Node.js API for Renderer process.
        // If you want use Node.js in Renderer process, the `nodeIntegration` needs to be enabled in the Main process.
        // See 👉 https://github.com/electron-vite/vite-plugin-electron-renderer
        renderer: {}
      })
    ],
    css: {
      preprocessorOptions: {
        scss: { api: "modern-compiler" }
      }
    },
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", __vite_injected_original_import_meta_url))
      }
    },
    server: {
      hmr: true,
      port: 5179,
      proxy: {
        [env.VITE_APP_API]: {
          target: env.VITE_APP_HOST,
          changeOrigin: true,
          rewrite: (path) => `${path}`.split(env.VITE_APP_API).join("")
        }
      }
    }
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiLCAicGFja2FnZS5qc29uIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1VzZXJzL3poL0RvY3VtZW50cy9wbGF5Z3JvdW5kL3Z1ZS10ZW1wbGF0ZS0xXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvemgvRG9jdW1lbnRzL3BsYXlncm91bmQvdnVlLXRlbXBsYXRlLTEvdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL3poL0RvY3VtZW50cy9wbGF5Z3JvdW5kL3Z1ZS10ZW1wbGF0ZS0xL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IGZzIGZyb20gJ25vZGU6ZnMnXG5pbXBvcnQgcGtnIGZyb20gJy4vcGFja2FnZS5qc29uJ1xuaW1wb3J0IHZ1ZSBmcm9tICdAdml0ZWpzL3BsdWdpbi12dWUnXG5pbXBvcnQgeyBkYXlqcyB9IGZyb20gJ2VsZW1lbnQtcGx1cydcbmltcG9ydCB7IGZpbGVVUkxUb1BhdGgsIFVSTCB9IGZyb20gJ25vZGU6dXJsJ1xuaW1wb3J0IHsgZGVmaW5lQ29uZmlnLCBsb2FkRW52IH0gZnJvbSBcInZpdGVcIjtcblxuaW1wb3J0IHRhaWx3aW5kY3NzIGZyb20gJ0B0YWlsd2luZGNzcy92aXRlJztcbmltcG9ydCBlbGVjdHJvbiBmcm9tICd2aXRlLXBsdWdpbi1lbGVjdHJvbi9zaW1wbGUnXG5pbXBvcnQgdnVlRGV2VG9vbHMgZnJvbSAndml0ZS1wbHVnaW4tdnVlLWRldnRvb2xzJ1xuaW1wb3J0IEF1dG9JbXBvcnQgZnJvbSAndW5wbHVnaW4tYXV0by1pbXBvcnQvdml0ZSdcbmltcG9ydCBDb21wb25lbnRzIGZyb20gJ3VucGx1Z2luLXZ1ZS1jb21wb25lbnRzL3ZpdGUnXG5cbmltcG9ydCB7IEVsZW1lbnRQbHVzUmVzb2x2ZXIgfSBmcm9tICd1bnBsdWdpbi12dWUtY29tcG9uZW50cy9yZXNvbHZlcnMnXG5cblxuXG4vLyBodHRwczovL3ZpdGUuZGV2L2NvbmZpZy9cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZygoeyBjb21tYW5kLCBtb2RlIH0pID0+IHtcbiAgY29uc3QgZW52ID0gbG9hZEVudihtb2RlLCBwcm9jZXNzLmN3ZCgpKTtcbiAgZnMucm1TeW5jKCdkaXN0LWVsZWN0cm9uJywgeyByZWN1cnNpdmU6IHRydWUsIGZvcmNlOiB0cnVlIH0pXG4gIGNvbnN0IGlzU2VydmUgPSBjb21tYW5kID09PSAnc2VydmUnXG4gIGNvbnN0IGlzQnVpbGQgPSBjb21tYW5kID09PSAnYnVpbGQnXG4gIGNvbnN0IHNvdXJjZW1hcCA9IGlzU2VydmUgfHwgISFwcm9jZXNzLmVudi5WU0NPREVfREVCVUdcbiAgcHJvY2Vzcy5lbnYuVklURV9BUFBfQlVJTERfVElNRSA9IGRheWpzKCkuZm9ybWF0KFwiWVlZWS1NTS1ERCBISDptbTpzc1wiKTtcbiAgcmV0dXJuIHtcbiAgICBiYXNlOiBlbnYuVklURV9BUFBfQkFTRV9VUkwsXG4gICAgcGx1Z2luczogW1xuICAgICAgdnVlKCksXG4gICAgICB2dWVEZXZUb29scygpLFxuICAgICAgQXV0b0ltcG9ydCh7XG4gICAgICAgIHJlc29sdmVyczogW0VsZW1lbnRQbHVzUmVzb2x2ZXIoKV0sXG4gICAgICB9KSxcbiAgICAgIENvbXBvbmVudHMoe1xuICAgICAgICByZXNvbHZlcnM6IFtFbGVtZW50UGx1c1Jlc29sdmVyKCldLFxuICAgICAgfSksXG4gICAgICB0YWlsd2luZGNzcygpLFxuICAgICAgZWxlY3Ryb24oe1xuICAgICAgICBtYWluOiB7XG4gICAgICAgICAgLy8gU2hvcnRjdXQgb2YgYGJ1aWxkLmxpYi5lbnRyeWBcbiAgICAgICAgICBlbnRyeTogJ2VsZWN0cm9uL21haW4vaW5kZXgudHMnLFxuICAgICAgICAgIG9uc3RhcnQoeyBzdGFydHVwIH0pIHtcbiAgICAgICAgICAgIGlmIChwcm9jZXNzLmVudi5WU0NPREVfREVCVUcpIHtcbiAgICAgICAgICAgICAgY29uc29sZS5sb2coLyogRm9yIGAudnNjb2RlLy5kZWJ1Zy5zY3JpcHQubWpzYCAqLydbc3RhcnR1cF0gRWxlY3Ryb24gQXBwJylcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHN0YXJ0dXAoKVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAgdml0ZToge1xuICAgICAgICAgICAgYnVpbGQ6IHtcbiAgICAgICAgICAgICAgc291cmNlbWFwLFxuICAgICAgICAgICAgICBtaW5pZnk6IGlzQnVpbGQsXG4gICAgICAgICAgICAgIG91dERpcjogJ2Rpc3QtZWxlY3Ryb24vbWFpbicsXG4gICAgICAgICAgICAgIHJvbGx1cE9wdGlvbnM6IHtcbiAgICAgICAgICAgICAgICAvLyBTb21lIHRoaXJkLXBhcnR5IE5vZGUuanMgbGlicmFyaWVzIG1heSBub3QgYmUgYnVpbHQgY29ycmVjdGx5IGJ5IFZpdGUsIGVzcGVjaWFsbHkgYEMvQysrYCBhZGRvbnMsIFxuICAgICAgICAgICAgICAgIC8vIHdlIGNhbiB1c2UgYGV4dGVybmFsYCB0byBleGNsdWRlIHRoZW0gdG8gZW5zdXJlIHRoZXkgd29yayBjb3JyZWN0bHkuXG4gICAgICAgICAgICAgICAgLy8gT3RoZXJzIG5lZWQgdG8gcHV0IHRoZW0gaW4gYGRlcGVuZGVuY2llc2AgdG8gZW5zdXJlIHRoZXkgYXJlIGNvbGxlY3RlZCBpbnRvIGBhcHAuYXNhcmAgYWZ0ZXIgdGhlIGFwcCBpcyBidWlsdC5cbiAgICAgICAgICAgICAgICAvLyBPZiBjb3Vyc2UsIHRoaXMgaXMgbm90IGFic29sdXRlLCBqdXN0IHRoaXMgd2F5IGlzIHJlbGF0aXZlbHkgc2ltcGxlLiA6KVxuICAgICAgICAgICAgICAgIGV4dGVybmFsOiBPYmplY3Qua2V5cygnZGVwZW5kZW5jaWVzJyBpbiBwa2cgPyBwa2cuZGVwZW5kZW5jaWVzIDoge30pLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgICBwcmVsb2FkOiB7XG4gICAgICAgICAgLy8gU2hvcnRjdXQgb2YgYGJ1aWxkLnJvbGx1cE9wdGlvbnMuaW5wdXRgLlxuICAgICAgICAgIC8vIFByZWxvYWQgc2NyaXB0cyBtYXkgY29udGFpbiBXZWIgYXNzZXRzLCBzbyB1c2UgdGhlIGBidWlsZC5yb2xsdXBPcHRpb25zLmlucHV0YCBpbnN0ZWFkIGBidWlsZC5saWIuZW50cnlgLlxuICAgICAgICAgIGlucHV0OiAnZWxlY3Ryb24vcHJlbG9hZC9pbmRleC50cycsXG4gICAgICAgICAgdml0ZToge1xuICAgICAgICAgICAgYnVpbGQ6IHtcbiAgICAgICAgICAgICAgc291cmNlbWFwOiBzb3VyY2VtYXAgPyAnaW5saW5lJyA6IHVuZGVmaW5lZCwgLy8gIzMzMlxuICAgICAgICAgICAgICBtaW5pZnk6IGlzQnVpbGQsXG4gICAgICAgICAgICAgIG91dERpcjogJ2Rpc3QtZWxlY3Ryb24vcHJlbG9hZCcsXG4gICAgICAgICAgICAgIHJvbGx1cE9wdGlvbnM6IHtcbiAgICAgICAgICAgICAgICBleHRlcm5hbDogT2JqZWN0LmtleXMoJ2RlcGVuZGVuY2llcycgaW4gcGtnID8gcGtnLmRlcGVuZGVuY2llcyA6IHt9KSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgICAgLy8gUGxveWZpbGwgdGhlIEVsZWN0cm9uIGFuZCBOb2RlLmpzIEFQSSBmb3IgUmVuZGVyZXIgcHJvY2Vzcy5cbiAgICAgICAgLy8gSWYgeW91IHdhbnQgdXNlIE5vZGUuanMgaW4gUmVuZGVyZXIgcHJvY2VzcywgdGhlIGBub2RlSW50ZWdyYXRpb25gIG5lZWRzIHRvIGJlIGVuYWJsZWQgaW4gdGhlIE1haW4gcHJvY2Vzcy5cbiAgICAgICAgLy8gU2VlIFx1RDgzRFx1REM0OSBodHRwczovL2dpdGh1Yi5jb20vZWxlY3Ryb24tdml0ZS92aXRlLXBsdWdpbi1lbGVjdHJvbi1yZW5kZXJlclxuICAgICAgICByZW5kZXJlcjoge30sXG4gICAgICB9KSxcbiAgICBdLFxuICAgIGNzczoge1xuICAgICAgcHJlcHJvY2Vzc29yT3B0aW9uczoge1xuICAgICAgICBzY3NzOiB7IGFwaTogJ21vZGVybi1jb21waWxlcicgfSxcbiAgICAgIH1cbiAgICB9LFxuICAgIHJlc29sdmU6IHtcbiAgICAgIGFsaWFzOiB7XG4gICAgICAgICdAJzogZmlsZVVSTFRvUGF0aChuZXcgVVJMKCcuL3NyYycsIGltcG9ydC5tZXRhLnVybCkpXG4gICAgICB9LFxuICAgIH0sXG4gICAgc2VydmVyOiB7XG4gICAgICBobXI6IHRydWUsXG4gICAgICBwb3J0OiA1MTc5LFxuICAgICAgcHJveHk6IHtcbiAgICAgICAgW2Vudi5WSVRFX0FQUF9BUEldOiB7XG4gICAgICAgICAgdGFyZ2V0OiBlbnYuVklURV9BUFBfSE9TVCxcbiAgICAgICAgICBjaGFuZ2VPcmlnaW46IHRydWUsXG4gICAgICAgICAgcmV3cml0ZTogKHBhdGgpID0+IGAke3BhdGh9YC5zcGxpdChlbnYuVklURV9BUFBfQVBJKS5qb2luKFwiXCIpLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9LFxuICB9XG59KVxuXG4iLCAie1xuICBcIm5hbWVcIjogXCJlbGVjdHJvbi12dWVcIixcbiAgXCJ2ZXJzaW9uXCI6IFwiMjQuMTIwNC4xNTUyXCIsXG4gIFwiZGVzY3JpcHRpb25cIjogXCJSZWFsbHkgc2ltcGxlIEVsZWN0cm9uICsgVnVlICsgVml0ZSBib2lsZXJwbGF0ZS5cIixcbiAgXCJhdXRob3JcIjoge1xuICAgIFwibmFtZVwiOiBcInJpcmg8aUB0aWdlcnpoLmNvbT5cIlxuICB9LFxuICBcInByaXZhdGVcIjogdHJ1ZSxcbiAgXCJ0eXBlXCI6IFwibW9kdWxlXCIsXG4gIFwibWFpblwiOiBcImRpc3QtZWxlY3Ryb24vbWFpbi9pbmRleC5qc1wiLFxuICBcInNjcmlwdHNcIjoge1xuICAgIFwiZGV2XCI6IFwidml0ZVwiLFxuICAgIFwiYnVpbGRcIjogXCJydW4tcCB0eXBlLWNoZWNrIFxcXCJidWlsZC1vbmx5IHtAfVxcXCIgLS1cIixcbiAgICBcInByZXZpZXdcIjogXCJ2aXRlIHByZXZpZXdcIixcbiAgICBcImJ1aWxkLW9ubHlcIjogXCJ2aXRlIGJ1aWxkXCIsXG4gICAgXCJ0eXBlLWNoZWNrXCI6IFwidnVlLXRzYyAtLWJ1aWxkIC0tZm9yY2VcIixcbiAgICBcImxpbnQ6b3hsaW50XCI6IFwib3hsaW50IC4gLS1maXggLUQgY29ycmVjdG5lc3MgLS1pZ25vcmUtcGF0aCAuZ2l0aWdub3JlXCIsXG4gICAgXCJsaW50OmVzbGludFwiOiBcImVzbGludCAuIC0tZml4XCIsXG4gICAgXCJsaW50XCI6IFwicnVuLXMgbGludDoqXCIsXG4gICAgXCJmb3JtYXRcIjogXCJwcmV0dGllciAtLXdyaXRlIHNyYy9cIixcbiAgICBcImJ1aWxkOmFwcFwiOiBcIm5wbSBydW4gYnVpbGQgJiYgZWxlY3Ryb24tYnVpbGRlclwiXG4gIH0sXG4gIFwiZGVwZW5kZW5jaWVzXCI6IHt9LFxuICBcImRldkRlcGVuZGVuY2llc1wiOiB7XG4gICAgXCJAdGFpbHdpbmRjc3Mvdml0ZVwiOiBcIl40LjAuMC1iZXRhLjRcIixcbiAgICBcIkB0YW5zdGFjay92dWUtcXVlcnlcIjogXCJeNS42Mi4yXCIsXG4gICAgXCJAdHNjb25maWcvbm9kZTIyXCI6IFwiXjIyLjAuMFwiLFxuICAgIFwiQHR5cGVzL2pzLWNvb2tpZVwiOiBcIl4zLjAuNlwiLFxuICAgIFwiQHR5cGVzL25vZGVcIjogXCJeMjIuOS4wXCIsXG4gICAgXCJAdml0ZWpzL3BsdWdpbi12dWVcIjogXCJeNS4xLjRcIixcbiAgICBcIkB2dWUvZXNsaW50LWNvbmZpZy1wcmV0dGllclwiOiBcIl4xMC4xLjBcIixcbiAgICBcIkB2dWUvZXNsaW50LWNvbmZpZy10eXBlc2NyaXB0XCI6IFwiXjE0LjEuM1wiLFxuICAgIFwiQHZ1ZS90c2NvbmZpZ1wiOiBcIl4wLjUuMVwiLFxuICAgIFwiYXV0b3ByZWZpeGVyXCI6IFwiXjEwLjQuMjBcIixcbiAgICBcImVsZWN0cm9uXCI6IFwiXjMzLjIuMVwiLFxuICAgIFwiZWxlY3Ryb24tYnVpbGRlclwiOiBcIl4yNS4xLjhcIixcbiAgICBcImVsZW1lbnQtcGx1c1wiOiBcIl4yLjguOFwiLFxuICAgIFwiZXNsaW50XCI6IFwiXjkuMTQuMFwiLFxuICAgIFwiZXNsaW50LXBsdWdpbi1veGxpbnRcIjogXCJeMC4xMS4wXCIsXG4gICAgXCJlc2xpbnQtcGx1Z2luLXZ1ZVwiOiBcIl45LjMwLjBcIixcbiAgICBcImpzLWNvb2tpZVwiOiBcIl4zLjAuNVwiLFxuICAgIFwibnBtLXJ1bi1hbGwyXCI6IFwiXjcuMC4xXCIsXG4gICAgXCJveGxpbnRcIjogXCJeMC4xMS4wXCIsXG4gICAgXCJwaW5pYVwiOiBcIl4yLjIuNlwiLFxuICAgIFwicG9zdGNzc1wiOiBcIl44LjQuNDlcIixcbiAgICBcInByZXR0aWVyXCI6IFwiXjMuMy4zXCIsXG4gICAgXCJ0YWlsd2luZGNzc1wiOiBcIl40LjAuMC1iZXRhLjRcIixcbiAgICBcInR5cGVzY3JpcHRcIjogXCJ+NS42LjNcIixcbiAgICBcInVucGx1Z2luLWF1dG8taW1wb3J0XCI6IFwiXjAuMTguNVwiLFxuICAgIFwidW5wbHVnaW4tdnVlLWNvbXBvbmVudHNcIjogXCJeMC4yNy40XCIsXG4gICAgXCJ2aXRlXCI6IFwiXjUuNC4xMFwiLFxuICAgIFwidml0ZS1wbHVnaW4tZWxlY3Ryb25cIjogXCJeMC4yOS4wXCIsXG4gICAgXCJ2aXRlLXBsdWdpbi1lbGVjdHJvbi1yZW5kZXJlclwiOiBcIl4wLjE0LjZcIixcbiAgICBcInZpdGUtcGx1Z2luLXZ1ZS1kZXZ0b29sc1wiOiBcIl43LjUuNFwiLFxuICAgIFwidnVlXCI6IFwiXjMuNS4xMlwiLFxuICAgIFwidnVlLXJvdXRlclwiOiBcIl40LjQuNVwiLFxuICAgIFwidnVl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

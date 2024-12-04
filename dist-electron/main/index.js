import { app as n, BrowserWindow as s, ipcMain as m, shell as w } from "electron";
import { createRequire as R } from "node:module";
import { fileURLToPath as _ } from "node:url";
import o from "node:path";
import h from "node:os";
R(import.meta.url);
const l = o.dirname(_(import.meta.url));
process.env.APP_ROOT = o.join(l, "../..");
const v = o.join(process.env.APP_ROOT, "dist-electron"), c = o.join(process.env.APP_ROOT, "dist"), t = process.env.VITE_DEV_SERVER_URL;
process.env.VITE_PUBLIC = t ? o.join(process.env.APP_ROOT, "public") : c;
h.release().startsWith("6.1") && n.disableHardwareAcceleration();
process.platform === "win32" && n.setAppUserModelId(n.getName());
n.requestSingleInstanceLock() || (n.quit(), process.exit(0));
let e = null;
const d = o.join(l, "../preload/index.mjs"), p = o.join(c, "index.html");
async function f() {
  e = new s({
    title: "Main window",
    icon: o.join(process.env.VITE_PUBLIC ?? "", "favicon.ico"),
    webPreferences: {
      preload: d
      // Warning: Enable nodeIntegration and disable contextIsolation is not secure in production
      // nodeIntegration: true,
      // Consider using contextBridge.exposeInMainWorld
      // Read more on https://www.electronjs.org/docs/latest/tutorial/context-isolation
      // contextIsolation: false,
    }
  }), t ? (e.loadURL(t), e.webContents.openDevTools()) : e.loadFile(p), e.webContents.on("did-finish-load", () => {
    e == null || e.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  }), e.webContents.setWindowOpenHandler(({ url: i }) => (i.startsWith("https:") && w.openExternal(i), { action: "deny" }));
}
n.whenReady().then(f);
n.on("window-all-closed", () => {
  e = null, process.platform !== "darwin" && n.quit();
});
n.on("second-instance", () => {
  e && (e.isMinimized() && e.restore(), e.focus());
});
n.on("activate", () => {
  const i = s.getAllWindows();
  i.length ? i[0].focus() : f();
});
m.handle("open-win", (i, r) => {
  const a = new s({
    webPreferences: {
      preload: d,
      nodeIntegration: !0,
      contextIsolation: !1
    }
  });
  t ? a.loadURL(`${t}#${r}`) : a.loadFile(p, { hash: r });
});
export {
  v as MAIN_DIST,
  c as RENDERER_DIST,
  t as VITE_DEV_SERVER_URL
};

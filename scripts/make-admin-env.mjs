import { spawn } from "node:child_process";
import path from "node:path";

const child = spawn(process.execPath, [path.resolve(import.meta.dirname, "set-admin-password.mjs")], {
  stdio: "inherit",
});
child.on("exit", (code) => process.exit(code ?? 0));

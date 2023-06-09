import { spawn } from "child_process";

process.stdin.on("data", (data) => {

    const child = spawn("node", ["./childProcess.js"], {
      stdio: ["inherit", "inherit", "inherit", "ipc"],
    });
    
    child.send(data.toString().trim());
});

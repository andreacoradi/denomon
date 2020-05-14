import { red, green } from "https://deno.land/std@v0.51.0/fmt/colors.ts";

const { args } = Deno;

if (args.length == 0) {
  console.log(`
  Usage:

    denomon <flags> <file> <args>
  `);
  Deno.exit(1);
}

let n = 0;

for (let i = 0; i < args.length; i++) {
  if (!args[i].startsWith("-")) {
    n = i;
    break;
  }
}
const flags = args.slice(0, n)
const file = args[n];

if(!file.endsWith(".ts") && !file.endsWith(".js")) {
  console.log(red(`Invalid file: '${file}'`));
  Deno.exit(1);
}

const appArgs = args.slice(n + 1);

let flag = false;

const fileWatched = Deno.watchFs(file);
let activeProcesses: Array<Deno.Process> = [];
const run = async () => {
  console.log(
    green("[denomon] starting `" + `deno run ${args.join(" ")}` + "`"),
  );
  const p = Deno.run({
    cmd: [
      "deno",
      "run",
      ...flags,
      file,
      ...appArgs,
    ],
    stdout: "inherit",
    stderr: "piped",
  });
  activeProcesses.push(p);

  p.status().then(async ({ code }) => {
    flag = false;
    if (code === 0) {
      activeProcesses.shift();
    } else if (code) {
      const rawError = await p.stderrOutput();
      const errorString = new TextDecoder().decode(rawError);
      if (errorString !== "") {
        {
          console.log(errorString);
          console.log(
            red(`The program has stopped unexpectedly! with code: ${code}`),
          );
          Deno.exit(code);
        }
      }
    }
  });
};

run();

for await (const event of fileWatched) {
  if (event.kind === "modify") {
    if (flag) {
      continue;
    }
    if (activeProcesses.length > 0) {
      const process = activeProcesses.shift();
      process!.kill(1);
      //process!.close()
    }
    flag = true;
    console.log(green("[denomon] restarting due to changes..."));
    run();
  }
}

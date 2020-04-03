import {red, green} from "https://deno.land/std/fmt/colors.ts"

const { args } = Deno;
const flags = args.filter((a) => a.startsWith("--allow-"));
const file = args.filter((a) => a.endsWith(".ts") || a.endsWith(".js"));

if (file.length > 1) {
    console.log(red("Too many files!"));
    Deno.exit(1);
} else if (file.length === 0) {
    console.log(red("You need to provide at least one file!"));
    Deno.exit(1);
}


let flag = false

const fileWatched = Deno.fsEvents(file[0]);
let activeProcesses: Array<Deno.Process> = [];
const run = async () => {
  
  console.log(green("Compiling..."));
  const p = Deno.run({
    cmd: [
      "deno",
      "run",
      ...flags,
      file[0],
    ],
    stdout: "inherit",
    stderr: "piped"
  });
  activeProcesses.push(p)
  
  p.status().then(async ({ code }) => {
    flag = false
    if(code === 0) {
        activeProcesses.shift()
    }else if(code){
        const rawError = await p.stderrOutput();
        const errorString = new TextDecoder().decode(rawError);
        if(errorString !== "") {{
            console.log(errorString);
            console.log(red(`The program has stopped unexpectedly! with code: ${code}`))
            Deno.exit(code)
        }}
    }
  });
};

run();

for await (const event of fileWatched) {
  if (event.kind === "modify") {
    if(flag) {
      continue
    }
    if(activeProcesses.length > 0) {
        const process = activeProcesses.shift()
        process!.kill(1)
    }
    flag = true
    run();
  }
}

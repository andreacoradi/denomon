import { serve } from "https://deno.land/std@v0.51.0/http/server.ts";

const s = serve({ port: 1337 });
console.log("http://localhost:1337/");

for await (const req of s) {
  // Change this!!
  req.respond({ body: "Hello World! 🦕" });
}
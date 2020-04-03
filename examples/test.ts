import { serve } from "https://deno.land/std@v0.38.0/http/server.ts";
const s = serve({ port: 1337 });
console.log("http://localhost:1337/");
for await (const req of s) {
  req.respond({ body: "Hello World!" });
}
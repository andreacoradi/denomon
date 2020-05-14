# DENOMON
This little script is inspired by [nodemon](https://nodemon.io/).

It's written in [deno](https://deno.land/) and meant to be used to run deno compatible scripts whenever the selected file is modified.

## Install
`git clone https://github.com/andreacoradi/denomon.git`

`cd denomon`

`deno install --force --unstable --allow-read --allow-run --name denomon mod.ts`

## Usage
`denomon <flags> <file> <args>`

## Examples
`denomon --allow-net examples/test.ts`

`denomon examples/test2.ts`

`denomon examples/test3.ts arg --flag`
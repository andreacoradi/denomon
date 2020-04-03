# DENOMON
This little script is inspired by [nodemon](https://nodemon.io/).

It's written in [deno](https://deno.land/) and meant to be used to run deno compatible scripts whenever the selected file is modified.

## Install
`deno install -f --allow-read --allow-run denomon main.ts`

## Usage
`denomon <file> <flags>`

## Examples
`denomon examples/test.ts --allow-net`

`denomon examples/test2.ts`
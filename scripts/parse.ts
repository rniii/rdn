#!/usr/bin/env tsx

import { readFileSync } from "fs";
import { parse } from "../src";

let hasFiles = false;
let root;
for (const opt of process.argv.slice(2)) {
    if (opt.startsWith("--root=")) {
        root = parse(opt.split("=")[1], [])[0];
    } else {
        console.log(parse(readFileSync(opt, "utf8"), root));
        hasFiles = true;
    }
}

if (!hasFiles) {
    console.log(parse(readFileSync(0, "utf8"), root));
}

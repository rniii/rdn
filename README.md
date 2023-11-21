# Imagine a format...

...where there simply is no format.

JSON? Some TOML? Clojure EDN? Mix and match as much as you'd like!

```js
rdn.parse(`
name = "rdn"
version = "0.1.0",
license = "Apache-2.0"
author = "rini <rini@rinici.de>"

scripts
{:build "esbuild src/index.ts --minify --bundle --outdir=dist --format=esm",
 :parse "tsx scripts/parse.ts"}

[devDependencies]
"@types/node": "^20.9.3",
"esbuild": "^0.19.7",
"tsx": "^4.1.4"
`);
```

:)

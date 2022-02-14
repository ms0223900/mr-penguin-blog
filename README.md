## Getting Start

### Install eslint and prettier

Use yarn or npm to install libraries below.
You can alias configs(.eslint.json, .prettier.json) in this repo.

- @typescript-eslint/eslint-plugin
- prettier
- eslint-config-prettier

```
npm i -D @typescript-eslint/eslint-plugin prettier eslint-config-prettier
```

### Install husky and run it

1. Install husky

```
npm i -D husky
```

2. If you cloned this repo first(init the project repo), you have to enable husky by run this command.

```
yarn husky istall
```

3. Add git hook

- tsc: check typescript types.
- eslint: lint by eslint.
- prettier: rewrite all your files by prettier rules.

```
yarn husky add .husky/pre-commit "yarn tsc --noEmit && yarn eslint . && yarn prettier --write ."
```

---

Reference: https://paulintrognon.fr/blog/typescript-prettier-eslint-next-js

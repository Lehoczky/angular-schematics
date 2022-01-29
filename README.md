# Opinionated schematics for new Angular projects

![lint status](https://github.com/lehoczky/angular-schematics/workflows/lint/badge.svg)
![publish status](https://github.com/lehoczky/angular-schematics/workflows/publish/badge.svg)

## What it does

1. adds `vscode` workspace settings and extension recommendations
2. installs and configures `stylelint`, `ESLint` (with plugins) and `prettier`
3. runs prettier on your source files

## Development

To test the schematic, create a new Angular CLI project:

```sh
ng new angular-test --minimal
```

and add the schematic to this newly created project:

```sh
ng add <relative_path_to_this_repository>
```

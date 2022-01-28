import { Tree } from '@angular-devkit/schematics'
import { readdirSync } from 'fs'
import { join } from 'path'

export function readFileAsString(tree: Tree, path: string): string {
  if (!tree.exists(path)) {
    throw new Error(`Could not find "${path}" in your workspace`)
  }
  return tree.read(path)!.toString('utf-8')
}

export function readJsonFile(tree: Tree, path: string): any {
  const rawFile = readFileAsString(tree, path)
  return JSON.parse(rawFile)
}

export function overwriteJsonFile(
  tree: Tree,
  path: string,
  content: any
): void {
  tree.overwrite(path, JSON.stringify(content, null, 2))
}

export function* walkSync(dir: string): Generator<string> {
  const files = readdirSync(dir, { withFileTypes: true })
  for (const file of files) {
    if (file.isDirectory()) {
      yield* walkSync(join(dir, file.name))
    } else {
      yield join(dir, file.name)
    }
  }
}

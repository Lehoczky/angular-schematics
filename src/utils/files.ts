import { Tree } from '@angular-devkit/schematics'

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

export function saveJsonFile(tree: Tree, path: string, content: any): void {
  if (tree.exists(path)) {
    overwriteJsonFile(tree, path, content)
  } else {
    createJsonFile(tree, path, content)
  }
}

function createJsonFile(tree: Tree, path: string, content: any): void {
  tree.create(path, JSON.stringify(content, null, 2))
}

function overwriteJsonFile(tree: Tree, path: string, content: any): void {
  tree.overwrite(path, JSON.stringify(content, null, 2))
}

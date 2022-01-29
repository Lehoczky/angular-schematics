import { Rule, Tree } from '@angular-devkit/schematics'
import { addLatestVersionToPackageJson } from '../utils/packages'
import * as prettier from 'prettier'
import { createJsonFile, readFileAsString, walkSync } from '../utils/files'

const PRETTIER_CONFIG = {
  arrowParens: 'avoid',
  endOfLine: 'auto',
  semi: false,
  singleQuote: true,
} as const

export function addPrettierToPackageJson(): Rule {
  return async (tree, context): Promise<void> => {
    await addLatestVersionToPackageJson(tree, context, 'prettier')
  }
}

export function addPrettierConfig(): Rule {
  return tree => {
    createJsonFile(tree, '.prettierrc', PRETTIER_CONFIG)
  }
}

export function runPrettierOnEverything(): Rule {
  return async (tree, context) => {
    const sourceFiles = walkSync('./src')
    const filesToCheck = [...sourceFiles, './.eslintrc.json', './angular.json']

    for (const filePath of filesToCheck) {
      if (canFormatFile(filePath)) {
        context.logger.info(`formatting: ${filePath} ...`)
        formatFile(tree, filePath)
      }
    }
  }
}

function canFormatFile(path: string): boolean {
  return (
    path.endsWith('ts') ||
    path.endsWith('html') ||
    path.endsWith('css') ||
    path.endsWith('scss') ||
    path.endsWith('json')
  )
}

function formatFile(tree: Tree, path: string): void {
  const rawText = readFileAsString(tree, path)
  const formattedText = prettier.format(rawText, {
    ...PRETTIER_CONFIG,
    filepath: path,
  })
  tree.overwrite(path, formattedText)
}

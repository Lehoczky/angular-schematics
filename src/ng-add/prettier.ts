import { Rule, Tree } from '@angular-devkit/schematics'
import { addLatestVersionToPackageJson } from '../utils/packages'
import * as prettier from 'prettier'
import { saveJsonFile, readFileAsString } from '../utils/files'
import * as walk from 'ignore-walk'

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
    saveJsonFile(tree, '.prettierrc', PRETTIER_CONFIG)
  }
}

export function runPrettierOnEverything(): Rule {
  return async tree => {
    const filesToCheck = walk.sync({ ignoreFiles: ['.gitignore'] })

    for (const filePath of filesToCheck) {
      if (canFormatFile(filePath)) {
        formatFile(tree, filePath)
      }
    }
  }
}

function canFormatFile(path: string): boolean {
  const supportedFileTypes = ['ts', 'html', 'css', 'scss', 'json', 'js']
  const ignoredFiles = ['lock.json']

  const isSupportedFile = supportedFileTypes.some(type => path.endsWith(type))
  const isIgnoredFile = ignoredFiles.some(name => path.endsWith(name))
  return isSupportedFile && !isIgnoredFile
}

function formatFile(tree: Tree, path: string): void {
  const rawText = readFileAsString(tree, path)
  const formattedText = prettier.format(rawText, {
    ...PRETTIER_CONFIG,
    filepath: path,
  })
  tree.overwrite(path, formattedText)
}

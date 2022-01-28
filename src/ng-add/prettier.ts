import {
  Rule,
  apply,
  MergeStrategy,
  mergeWith,
  move,
  url,
} from '@angular-devkit/schematics'
import { addLatestVersionToPackageJson } from '../utils/packages'
import * as prettier from 'prettier'
import { readFileAsString, walkSync } from '../utils/files'

export function addPrettierToPackageJson(): Rule {
  return async (tree, context): Promise<void> => {
    await addLatestVersionToPackageJson(tree, context, 'prettier')
  }
}

export function addPrettierConfig(): Rule {
  return (tree, context) => {
    const templateSource = apply(url('./files-prettier'), [move('./')])
    return mergeWith(templateSource, MergeStrategy.Overwrite)(tree, context)
  }
}

export function runPrettierOnEverything(): Rule {
  return async (tree, context) => {
    const config = {
      arrowParens: 'avoid',
      endOfLine: 'auto',
      semi: false,
      singleQuote: true,
    } as const

    const files = [...walkSync('./src')]

    for (const filePath of [...files, './.eslintrc.json', './angular.json']) {
      if (
        filePath.endsWith('ts') ||
        filePath.endsWith('html') ||
        filePath.endsWith('css') ||
        filePath.endsWith('scss') ||
        filePath.endsWith('json')
      ) {
        const rawText = readFileAsString(tree, filePath)
        const formattedText = prettier.format(rawText, {
          ...config,
          filepath: filePath,
        })
        tree.overwrite(filePath, formattedText)
      }
    }
  }
}

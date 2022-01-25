import {
  Rule,
  Tree,
  SchematicContext,
  apply,
  MergeStrategy,
  mergeWith,
  move,
  url,
} from '@angular-devkit/schematics'
import {
  addPackageToPackageJson,
  DependencyType,
  getLatestVersion,
} from '../utils/packages'
import * as prettier from 'prettier'
import * as fs from 'fs'
import * as path from 'path'

export function addPrettierToPackageJson(): Rule {
  return async (tree: Tree, context: SchematicContext): Promise<void> => {
    const version = await getLatestVersion(context, 'prettier')
    addPackageToPackageJson(tree, DependencyType.Dev, 'prettier', version)
  }
}

export function addPrettierConfig(): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const templateSource = apply(url('./files-prettier'), [move('./')])
    return mergeWith(templateSource, MergeStrategy.Overwrite)(tree, context)
  }
}

export function runPrettierOnEverything(): Rule {
  return async (tree: Tree, context: SchematicContext) => {
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
        const rawText = tree.read(filePath)!.toString('utf-8')
        const formattedText = prettier.format(rawText, {
          ...config,
          filepath: filePath,
        })
        tree.overwrite(filePath, formattedText)
      }
    }
  }
}

function* walkSync(dir: string): Generator<string> {
  const files = fs.readdirSync(dir, { withFileTypes: true })
  for (const file of files) {
    if (file.isDirectory()) {
      yield* walkSync(path.join(dir, file.name))
    } else {
      yield path.join(dir, file.name)
    }
  }
}

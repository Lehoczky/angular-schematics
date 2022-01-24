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

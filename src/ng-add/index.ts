import {
  apply,
  chain,
  MergeStrategy,
  mergeWith,
  move,
  Rule,
  SchematicContext,
  Tree,
  url,
} from '@angular-devkit/schematics'
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks'
import {
  addPackageToPackageJson,
  DependencyType,
  getLatestVersion,
} from '../utils/packages'

export default function (_options: any): Rule {
  return chain([
    addDependencies(),
    addFiles(),
    // installPackages()
  ])
}

function addDependencies(): Rule {
  return async (tree: Tree, context: SchematicContext): Promise<void> => {
    const DEPENDENCIES = ['prettier', 'stylelint']

    for (const dependency of DEPENDENCIES) {
      const version = await getLatestVersion(context, dependency)
      addPackageToPackageJson(tree, DependencyType.Dev, dependency, version)
    }
  }
}

function installPackages(): Rule {
  return (tree: Tree, context: SchematicContext): Tree => {
    context.addTask(new NodePackageInstallTask())
    return tree
  }
}

function addFiles(): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const templateSource = apply(url('./files'), [move('./')])
    return mergeWith(templateSource, MergeStrategy.Overwrite)(tree, context)
  }
}

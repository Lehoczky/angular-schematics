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
  getLatestVersion,
  addPackageToPackageJson,
  DependencyType,
} from '../utils/packages'

export function addStylelintToPackageJson(): Rule {
  return async (tree: Tree, context: SchematicContext): Promise<void> => {
    const [stylelintVersion, configStandardVersion, configPrettierVersion] =
      await Promise.all([
        getLatestVersion(context, 'stylelint'),
        getLatestVersion(context, 'stylelint-config-prettier'),
        getLatestVersion(context, 'stylelint-config-standard'),
      ])

    addPackageToPackageJson(
      tree,
      DependencyType.Dev,
      'stylelint',
      stylelintVersion
    )
    addPackageToPackageJson(
      tree,
      DependencyType.Dev,
      'stylelint-config-prettier',
      configStandardVersion
    )
    addPackageToPackageJson(
      tree,
      DependencyType.Dev,
      'stylelint-config-standard',
      configPrettierVersion
    )
  }
}

export function addStylelintConfig(): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const templateSource = apply(url('./files-stylelint'), [move('./')])
    return mergeWith(templateSource, MergeStrategy.Overwrite)(tree, context)
  }
}

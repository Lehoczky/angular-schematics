import {
  Rule,
  Tree,
  SchematicContext,
  externalSchematic,
} from '@angular-devkit/schematics'
import {
  getLatestVersion,
  addPackageToPackageJson,
  DependencyType,
} from '../utils/packages'

export function runAngualESLintSchematic(): Rule {
  return externalSchematic('@angular-eslint/schematics', 'ng-add', {})
}

export function addESLintPluginsToPackageJson(): Rule {
  return async (tree: Tree, context: SchematicContext): Promise<void> => {
    const [configPrettierVersion, onlyWarnVersion] = await Promise.all([
      getLatestVersion(context, 'eslint-config-prettier'),
      getLatestVersion(context, 'eslint-plugin-only-warn'),
    ])

    addPackageToPackageJson(
      tree,
      DependencyType.Dev,
      'eslint-config-prettier',
      configPrettierVersion
    )
    addPackageToPackageJson(
      tree,
      DependencyType.Dev,
      'eslint-plugin-only-warn',
      onlyWarnVersion
    )
  }
}

export function addEslintPluginsToConfig(): Rule {
  return (tree: Tree) => {
    if (!tree.exists('.eslintrc.json')) {
      throw new Error(
        'Could not find a `.eslintrc.json` file at the root of your workspace'
      )
    }

    const rawFile = tree.read('.eslintrc.json')!.toString('utf-8')
    const eslintrc = JSON.parse(rawFile)

    eslintrc.plugins = ['only-warn']

    const tsRules = eslintrc.overrides.find(
      (block: any) => block.files[0] === '*.ts'
    )
    tsRules['extends'].push('prettier')

    tree.overwrite('.eslintrc.json', JSON.stringify(eslintrc, null, 2))
    return tree
  }
}

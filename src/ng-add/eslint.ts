import { Rule, externalSchematic } from '@angular-devkit/schematics'
import { overwriteJsonFile, readJsonFile } from '../utils/files'
import { addLatestVersionToPackageJson } from '../utils/packages'

export function runAngualESLintSchematic(): Rule {
  return externalSchematic('@angular-eslint/schematics', 'ng-add', {})
}

export function addESLintPluginsToPackageJson(): Rule {
  return async (tree, context): Promise<void> => {
    const addToPackages = (name: string) =>
      addLatestVersionToPackageJson(tree, context, name)

    await Promise.all([
      addToPackages('eslint-config-prettier'),
      addToPackages('eslint-plugin-only-warn'),
    ])
  }
}

export function addEslintPluginsToConfig(): Rule {
  return tree => {
    const eslintrc = readJsonFile(tree, '.eslintrc.json')

    eslintrc.plugins = ['only-warn']

    const tsConfig = getTypeScriptConfiguration(eslintrc)
    tsConfig.extends.push('prettier')

    overwriteJsonFile(tree, '.eslintrc.json', eslintrc)
    return tree
  }
}

function getTypeScriptConfiguration(config: any) {
  const { overrides } = config
  const isTypeScriptGlob = (glob: string) => glob == '*.ts'
  return overrides.find((block: any) => block.files.some(isTypeScriptGlob))
}

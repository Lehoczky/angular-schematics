import { chain, Rule } from '@angular-devkit/schematics'
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks'
import { orderDevDependenciesInPackageJson } from '../utils/packages'
import {
  addEslintPluginsToConfig,
  addESLintPluginsToPackageJson,
  runAngualESLintSchematic,
} from './eslint'
import {
  addPrettierToPackageJson,
  addPrettierConfig,
  runPrettierOnEverything,
} from './prettier'
import { addStylelintToPackageJson, addStylelintConfig } from './stylelint'
import { addVSCodeFiles } from './vscode'

export default function (_options: any): Rule {
  return chain([
    info('adding vscode related files...'),
    addVSCodeFiles(),
    info('setting up stylelint...'),
    addStylelintToPackageJson(),
    addStylelintConfig(),
    info('setting up eslint...'),
    runAngualESLintSchematic(),
    addESLintPluginsToPackageJson(),
    addEslintPluginsToConfig(),
    info('setting up prettier...'),
    addPrettierToPackageJson(),
    addPrettierConfig(),
    runPrettierOnEverything(),
    info('last touches...'),
    orderDevDependenciesInPackageJson(),
    installPackages(),
  ])
}

function info(message: string): Rule {
  return (_tree, context) => context.logger.info(message)
}

function installPackages(): Rule {
  return (_tree, context): void => {
    context.addTask(new NodePackageInstallTask())
  }
}

import { chain, Rule } from '@angular-devkit/schematics'
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks'
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
    addPrettierToPackageJson(),
    addPrettierConfig(),
    addStylelintToPackageJson(),
    addStylelintConfig(),
    addVSCodeFiles(),
    runAngualESLintSchematic(),
    addESLintPluginsToPackageJson(),
    addEslintPluginsToConfig(),
    runPrettierOnEverything(),
    // installPackages(),
  ])
}

function installPackages(): Rule {
  return (_tree, context): void => {
    context.addTask(new NodePackageInstallTask())
  }
}

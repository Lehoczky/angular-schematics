import {
  Rule,
  apply,
  MergeStrategy,
  mergeWith,
  move,
  url,
} from '@angular-devkit/schematics'
import { addLatestVersionToPackageJson } from '../utils/packages'

export function addStylelintToPackageJson(): Rule {
  return async (tree, context): Promise<void> => {
    const addToPackages = (name: string) =>
      addLatestVersionToPackageJson(tree, context, name)

    await Promise.all([
      addToPackages('stylelint'),
      addToPackages('stylelint-config-prettier'),
      addToPackages('stylelint-config-standard'),
    ])
  }
}

export function addStylelintConfig(): Rule {
  return () => {
    const templateSource = apply(url('./files-stylelint'), [move('./')])
    return mergeWith(templateSource, MergeStrategy.Overwrite)
  }
}

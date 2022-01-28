import {
  Rule,
  url,
  move,
  mergeWith,
  MergeStrategy,
  apply,
} from '@angular-devkit/schematics'

export function addVSCodeFiles(): Rule {
  return () => {
    const templateSource = apply(url('./files-vscode'), [move('./.vscode')])
    return mergeWith(templateSource, MergeStrategy.Overwrite)
  }
}

import {
  Rule,
  Tree,
  SchematicContext,
  url,
  move,
  mergeWith,
  MergeStrategy,
  apply,
} from '@angular-devkit/schematics'

export function addVSCodeFiles(): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const templateSource = apply(url('./files-vscode'), [move('./.vscode')])
    return mergeWith(templateSource, MergeStrategy.Overwrite)(tree, context)
  }
}

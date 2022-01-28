import { SchematicContext, Tree } from '@angular-devkit/schematics'
import axios from 'axios'
import { overwriteJsonFile, readJsonFile } from './files'

export async function addLatestVersionToPackageJson(
  tree: Tree,
  context: SchematicContext,
  packageName: string
): Promise<void> {
  const version = await getLatestVersion(context, packageName)
  await addPackageToPackageJson(tree, packageName, version)
}

async function addPackageToPackageJson(
  tree: Tree,
  name: string,
  version: string
): Promise<void> {
  const packageJson = readJsonFile(tree, 'package.json')

  if (!packageJson.devDependencies) {
    packageJson.devDependencies = {}
  }

  if (!packageJson.devDependencies[name]) {
    packageJson.devDependencies[name] = version
  }

  overwriteJsonFile(tree, 'package.json', packageJson)
}

async function getLatestVersion(
  context: SchematicContext,
  packageName: string
): Promise<string> {
  const DEFAULT_VERSION = 'latest'

  try {
    const url = `http://registry.npmjs.org/${packageName}`
    const response = await axios.get(url)
    const versions = response.data['dist-tags']

    return versions.latest || DEFAULT_VERSION
  } catch (error) {
    context.logger.warn(
      `Could not fetch version for package: ${packageName}, installing ${DEFAULT_VERSION}`
    )
    return DEFAULT_VERSION
  }
}

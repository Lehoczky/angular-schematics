import { SchematicContext, Tree } from '@angular-devkit/schematics'
import axios from 'axios'

export enum DependencyType {
  Default = 'dependencies',
  Dev = 'devDependencies',
  Peer = 'peerDependencies',
  Optional = 'optionalDependencies',
}

export async function addPackageToPackageJson(
  host: Tree,
  dependenyType: DependencyType,
  name: string,
  version: string
): Promise<Tree> {
  if (!host.exists('package.json')) {
    throw new Error(
      'Could not find a `package.json` file at the root of your workspace'
    )
  }

  const rawFile = host.read('package.json')!.toString('utf-8')
  const packageJson = JSON.parse(rawFile)

  if (!packageJson[dependenyType]) {
    packageJson[dependenyType] = {}
  }

  if (!packageJson[dependenyType][name]) {
    packageJson[dependenyType][name] = version
  }

  host.overwrite('package.json', JSON.stringify(packageJson, null, 2))

  return host
}

export async function getLatestVersion(
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
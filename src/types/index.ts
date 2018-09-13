export interface NuxtProjectGeneratorOptions {
  generateAllFiles?: boolean
  generateConfigFile?: boolean
  generatePackageFile?: boolean
  generateESLintFile?: boolean
}

export interface PackageConfig {
  author: string
  dependencies: { [key: string]: string }
  devDependencies: { [key: string]: string }
  name?: string
  scripts: { [key: string]: string }
  version: string
}

export interface ESLintConfig {
  root: boolean
  env: { [key: string]: boolean }
  parserOptions?: { [key: string]: string }
  extends?: string[]
  plugins?: string[]
  rules?: { [key: string]: any }
}

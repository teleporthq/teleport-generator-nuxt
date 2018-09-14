import { FileSet, ComponentCodeGenerator } from '@teleporthq/teleport-lib-js'
import TeleportGeneratorVue from 'teleport-generator-vue'
import { Project, Component, ProjectGeneratorOptions, ComponentGeneratorOptions } from '@teleporthq/teleport-lib-js/dist/types'
import { NuxtProjectGeneratorOptions } from './types'
import NuxtFilesGenerator from './generators'
import { join } from 'path'

export default class TeleportGeneratorNuxt extends TeleportGeneratorVue {
  constructor(name?: string, targetName?: string, customRenderers?: { [key: string]: ComponentCodeGenerator }) {
    super(name || 'nuxt-generator', targetName || 'nuxt', customRenderers)
  }

  public generateComponent(component: Component, options: ComponentGeneratorOptions): FileSet {
    return this.componentGenerator.generate(component, { ...options })
  }

  public generateProject(project: Project, options: ProjectGeneratorOptions & NuxtProjectGeneratorOptions): FileSet {
    const { generateAllFiles, generatePackageFile, generateConfigFile, generateESLintFile, ...projectGeneratorOptions } = options
    const result = this.projectGenerator.generate(project, { ...projectGeneratorOptions })

    if (generatePackageFile || generateAllFiles) {
      result.merge(this.generatePackageFile(project.slug))
    }

    if (generateConfigFile || generateAllFiles) {
      result.merge(this.generateConfigFile(project, generateESLintFile, { ...projectGeneratorOptions }))
    }

    if (generateESLintFile || generateAllFiles) {
      result.merge(this.generateESLintFile())
    }

    return result
  }

  private generatePackageFile(projectSlug: string): FileSet {
    const result = new FileSet()
    const pck = NuxtFilesGenerator.generateNuxtPackage(projectSlug)
    result.addFile('package.json', pck)
    return result
  }

  private generateConfigFile(project: Project, includeESLintRules: boolean, options: any): FileSet {
    const result = new FileSet()
    const configFile = NuxtFilesGenerator.generateNuxtConfigFile(project, includeESLintRules, options)
    const styleFile = NuxtFilesGenerator.generateStyleFileFromMeta(project.targets)
    const cssPath = join(options.assetsUrl, 'css', 'main.css')

    result.addFile('nuxt.config.js', configFile)
    result.addFile(cssPath, styleFile)
    return result
  }

  private generateESLintFile(): FileSet {
    const result = new FileSet()
    const eslintFile = NuxtFilesGenerator.generateNuxtESLintFile()
    result.addFile('.eslintrc.js', eslintFile)
    return result
  }
}

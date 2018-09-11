import { FileSet, ComponentCodeGenerator } from '@teleporthq/teleport-lib-js'
import TeleportGeneratorVue from 'teleport-generator-vue'
import { Project, Component, ProjectGeneratorOptions, ComponentGeneratorOptions } from '@teleporthq/teleport-lib-js/dist/types'
import { NuxtProjectGeneratorOptions } from './types'
import NuxtFilesGenerator from './generators'

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
      result.merge(this.generateConfigFile(project.slug, generateESLintFile))
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

  private generateConfigFile(projectSlug: string, includeESLintRules: boolean): FileSet {
    const result = new FileSet()
    const configFile = NuxtFilesGenerator.generateNuxtConfigFile(projectSlug, includeESLintRules)
    result.addFile('nuxt.config.js', configFile)
    return result
  }

  private generateESLintFile(): FileSet {
    const result = new FileSet()
    const eslintFile = NuxtFilesGenerator.generateNuxtESLintFile()
    result.addFile('.eslintrc.js', eslintFile)
    return result
  }
}

import { Generator, RenderResult } from '../teleport-lib-js'
import NuxtComponentGenerator from './generators/component'
import NuxtProjectGenerator from './generators/project'

export default class TeleportGeneratorNuxt extends Generator {
  constructor() {
    super('nuxt-generator', 'nuxt')

    this.componentGenerator = new NuxtComponentGenerator(this)
    this.projectGenerator = new NuxtProjectGenerator(this, this.componentGenerator)
  }

  public generateComponent(component: any, options: any): RenderResult {
    return this.componentGenerator.generate(component, options)
  }

  public generateProject(component: any, options: any): RenderResult {
    return this.projectGenerator.generate(component, options)
  }
}

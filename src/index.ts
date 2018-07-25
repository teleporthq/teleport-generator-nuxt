import { Generator, FileSet } from '@teleporthq/teleport-lib-js'
import NuxtComponentGenerator from './generators/component'
import NuxtProjectGenerator from './generators/project'

export default class TeleportGeneratorNuxt extends Generator {
  // @todo: can we avoid redeclaring componentGenerator and projectGenerator since they exist on Generator?
  public componentGenerator: NuxtComponentGenerator
  public projectGenerator: NuxtProjectGenerator

  constructor() {
    super('nuxt-generator', 'nuxt')

    this.componentGenerator = new NuxtComponentGenerator(this)
    this.projectGenerator = new NuxtProjectGenerator(this, this.componentGenerator)
  }

  public generateComponent<T, U>(component: T, options: U): FileSet {
    return this.componentGenerator.generate(component, options)
  }

  public generateProject(component: any, options: any): FileSet {
    return this.projectGenerator.generate(component, options)
  }
}

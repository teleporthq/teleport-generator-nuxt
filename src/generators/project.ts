import { ProjectGenerator, Generator, FileSet } from 'teleport-lib-js'

import TeleportGeneratorNuxt from '../index'
import packageRenderer from '../renderers/package'
import NuxtComponentGenerator from './component'

export default class NuxtProjectGenerator extends ProjectGenerator {
  public generator: TeleportGeneratorNuxt
  public componentGenerator: NuxtComponentGenerator

  constructor(generator: TeleportGeneratorNuxt, componentGenerator: NuxtComponentGenerator) {
    super(generator as Generator)
    this.componentGenerator = componentGenerator
  }

  public generate(project: any, options: any = {}): FileSet {
    const { name, components, pages } = project

    const result = new FileSet()
    result.addFile(
      'package.json',
      packageRenderer(project)
    )

    if (components) {
      Object.keys(components).map(componentName => {
        const component = components[componentName]
        const componentResults = this.componentGenerator.generate(component)
        componentResults.getFileNames().map(fileName => {
          result.addFile(
            `components/${fileName}`,
            componentResults.getContent(fileName)
          )
        })
      })
    }

    if (pages) {
      Object.keys(pages).map(pageName => {
        const page = pages[pageName]
        const pageResults = this.componentGenerator.generate(page)
        pageResults.getFileNames().map(fileName => {
          result.addFile(
            `pages/${fileName}`,
            pageResults.getContent(fileName)
          )
        })
      })
    }

    return result
  }

  public publish(path: string, archive: boolean = false): void {

  }
}

import TeleportGeneratorVue from '@teleporthq/teleport-generator-vue'
import { FileSet, Target } from '@teleporthq/teleport-lib-js'
import TeleportGeneratorNuxt from '../../src'
import getFromLocal from './utils/getFromLocal'

const data = getFromLocal('generators/data.json')

describe('Nuxt generator', () => {
  it('should return a Vue generator', () => {
    const generator = new TeleportGeneratorNuxt()
    expect(generator).toBeInstanceOf(TeleportGeneratorVue)
    expect(generator.targetName).toBe('nuxt')
  })

  it('should generate component', () => {
    const { component } = data
    const generator = new TeleportGeneratorNuxt()
    const target = new Target('nuxt')

    const result = generator.generateComponent(component, { target })
    expect(result).toBeInstanceOf(FileSet)
  })

  it('should generate project without other files', () => {
    const { project } = data
    const generator = new TeleportGeneratorNuxt('nuxt-generator', 'nuxt', {})
    const target = new Target('nuxt')

    const result = generator.generateProject(project, { target })
    const componentsCount = Object.keys(project.components).length
    const pagesCount = Object.keys(project.pages).length

    expect(result).toBeInstanceOf(FileSet)
    expect(Object.keys(result.filesByName).length).toBe(componentsCount + pagesCount)
  })

  it('should generate project with config files', () => {
    const { project } = data
    const generator = new TeleportGeneratorNuxt()
    const target = new Target('nuxt')
    const options = {
      target,
      generateAllFiles: true,
      generatePackageFile: true,
      generateConfigFile: true,
      generateESLintFile: true,
    }

    const result = generator.generateProject(project, options)
    const componentsCount = Object.keys(project.components).length
    const pagesCount = Object.keys(project.pages).length

    expect(result).toBeInstanceOf(FileSet)
    expect(Object.keys(result.filesByName).length).toBe(componentsCount + pagesCount + 4)
  })
})

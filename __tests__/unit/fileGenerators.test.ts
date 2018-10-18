import NuxtFilesGenerator from '../../src/generators'
import getFromLocal from './utils/getFromLocal'

const data = getFromLocal('generators/data.json')

describe('Generators', () => {
  it('should not generate style file from empty meta', () => {
    const result = NuxtFilesGenerator.generateStyleFileFromMeta(null)
    expect(result).toBe('')
  })

  it('should generate style file from meta', () => {
    const { meta } = data
    const result = NuxtFilesGenerator.generateStyleFileFromMeta(meta)
    expect(typeof result).toBe('string')
    expect(result.length).toBeGreaterThan(0)
  })

  it('should generate nuxt package', () => {
    const slug = 'test'
    const pack = NuxtFilesGenerator.generateNuxtPackage(slug)
    const packageData = JSON.parse(pack)
    expect(packageData.name).toBe(slug)
  })

  it('should generate eslint file', () => {
    const eslint = NuxtFilesGenerator.generateNuxtESLintFile()
    expect(typeof eslint).toBe('string')
  })

  it('should generate nuxt config file without eslint rules and without targets', () => {
    const { project } = data
    const configFile = NuxtFilesGenerator.generateNuxtConfigFile(project, false, {})
    expect(typeof configFile).toBe('string')
  })

  it('should generate nuxt config file without eslint rules', () => {
    const { project, meta } = data
    project.targets = meta
    const configFile = NuxtFilesGenerator.generateNuxtConfigFile(project, false, {})
    expect(typeof configFile).toBe('string')
  })

  it('should generate nuxt config file with eslint rules', () => {
    const { project } = data
    const configFile = NuxtFilesGenerator.generateNuxtConfigFile(project, true, {})
    expect(typeof configFile).toBe('string')
  })
})

import { Project } from '@teleporthq/teleport-lib-js/dist/types'
import upperFirst from 'lodash/upperFirst'
import { PACKAGE_CONFIG, ESLIT_CONFIG, CONFIG_FILE_BUILD } from '../constants'

export default class NuxtFilesGenerator {
  public static generateStyleFileFromMeta(targets: any): any {
    if (!targets || !targets.web || !targets.web.head) {
      return ''
    }
    const styles = targets.web.head.filter((target) => target.tagName === 'style').map((target) => target.innerString)
    return styles.join('\n')
  }

  public static generateNuxtPackage(projectSlug: string): string {
    const pkg = PACKAGE_CONFIG
    pkg.name = projectSlug
    return JSON.stringify(pkg, null, 2)
  }

  public static generateNuxtConfigFile(project: Project, includeESLintRules: boolean, options: any): string {
    const head = getConfigFileHead(project)
    const routes = generateProjectRoutes(project.pages, options.pagesPath)
    const build = includeESLintRules ? CONFIG_FILE_BUILD : ''
    const loading = JSON.stringify({ color: '#3B8070' })

    return `
      module.exports = {
        head: ${head},
        router: { extendRoutes(routes) { ${routes} } },
        /*
        ** Customize the progress bar color
        */
        loading: ${loading},
        css: [ "~${options.assetsUrl}/css/main.css" ],
        build: { ${build} }
      }
    `
  }

  public static generateNuxtESLintFile(): string {
    const config = JSON.stringify(ESLIT_CONFIG, null, 2)
    return `module.exports = ${config} `
  }
}

function getConfigFileHead(project: Project): string {
  const metaFile = getProjectMeta(project.targets)
  metaFile.title = project.accountSlug
  return JSON.stringify(metaFile, null, 2)
}

function getProjectMeta(targets: any): any {
  if (!targets || !targets.web || !targets.web.head) {
    return {}
  }
  const meta = {}
  targets.web.head.forEach(({ innerString, attributes, tagName }) => {
    if (tagName === 'style') {
      return
    }
    if (innerString) {
      meta[tagName] = innerString
      return
    }
    if (!meta[tagName]) {
      meta[tagName] = []
    }
    meta[tagName].push(attributes)
  })
  return meta
}

function generateProjectRoutes(projectPages: any, pagesPath: string): string {
  const routes = Object.keys(projectPages).map((page) => {
    const route = {
      component: `${pagesPath}/${upperFirst(page)}.vue`,
      name: page,
      path: `/${projectPages[page].url}`,
    }
    return `routes.push(${JSON.stringify(route)})`
  })
  return routes.join('\n')
}

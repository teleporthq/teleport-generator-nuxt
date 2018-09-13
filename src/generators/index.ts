import { Project } from '@teleporthq/teleport-lib-js/dist/types'
import upperFirst from 'lodash/upperFirst'
import { join } from 'path'

export default class NuxtFilesGenerator {
  public static generateStyleFileFromMeta(targets: any): any {
    if (!targets || !targets.web || !targets.web.head) {
      return ''
    }
    const styles = targets.web.head.filter((target) => target.tagName === 'style').map((target) => target.innerString)
    return styles.join('\n')
  }

  public static generateNuxtPackage(projectSlug: string): string {
    const pkg = {
      author: 'Unknown',
      dependencies: {
        nuxt: '^1.0.0',
      },
      devDependencies: {
        'babel-eslint': '^8.2.1',
        eslint: '^4.15.0',
        'eslint-friendly-formatter': '^3.0.0',
        'eslint-loader': '^1.7.1',
        'eslint-plugin-vue': '^4.0.0',
      },
      name: projectSlug,
      scripts: {
        build: 'nuxt build',
        dev: 'nuxt',
        generate: 'nuxt generate',
        lint: 'eslint --ext .js,.vue --ignore-path .gitignore .',
        precommit: 'npm run lint',
        start: 'nuxt start',
      },
      version: '1.0.0',
    }
    return JSON.stringify(pkg, null, 2)
  }

  public static generateNuxtConfigFile(project: Project, includeESLintRules: boolean, options: any): string {
    const head = getConfigFileHead(project)
    const routes = generateProjectRoutes(project.pages, options.pagesPath)
    const build = includeESLintRules ? getConfigFileBuild() : ''
    const loading = JSON.stringify({ color: '#3B8070' })

    return `
      module.exports = {
        head: ${head},
        /*
        ** Customize the progress bar color
        */
        router: { extendRoutes(routes) { ${routes} } },
        loading: ${loading},
        css: [ "~${options.assetsUrl}/css/main.css" ],
        build: { ${build} }
      }
    `
  }

  public static generateNuxtESLintFile(): string {
    const config = getESLintFileContent()
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
    const pagePath = join(pagesPath, upperFirst(page))
    const route = {
      name: page,
      path: `/${projectPages[page].url}`,
      component: `${pagePath}.vue`,
    }
    return `routes.push(${JSON.stringify(route)})`
  })
  return routes.join('\n')
}

function getConfigFileBuild(): string {
  return `
    extend(config, { isDev, isClient }) {
      if (isDev && isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  `
}

function getESLintFileContent(): string {
  const lintConfig = {
    root: true,
    env: {
      browser: true,
      node: true,
    },
    parserOptions: {
      parser: 'babel-eslint',
    },
    extends: ['plugin:vue/essential'],
    plugins: ['vue'],
    rules: {},
  }
  return JSON.stringify(lintConfig, null, 2)
}

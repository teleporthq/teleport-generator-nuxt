export default class NuxtFilesGenerator {
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

  public static generateNuxtConfigFile(projectSlug: string, includeESLintRules: boolean): string {
    const head = getConfigFileHead(projectSlug)
    const build = includeESLintRules ? getConfigFileBuild() : ''
    const loading = JSON.stringify({ color: '#3B8070' })

    return `
      module.exports = {
        head: ${head},
        /*
        ** Customize the progress bar color
        */
        loading: ${loading},
        build: { ${build} }
      }
    `
  }

  public static generateNuxtESLintFile(): string {
    const config = getESLintFileContent()
    return `module.exports = ${config} `
  }
}

function getConfigFileHead(projectSlug: string): string {
  const head = {
    title: projectSlug,
    meta: [{ charset: 'utf-8' }, { name: 'viewport', content: 'width=device-width, initial-scale=1' }],
  }
  return JSON.stringify(head, null, 2)
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

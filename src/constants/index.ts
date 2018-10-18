import { PackageConfig, ESLintConfig } from '../types'

export const PACKAGE_CONFIG: PackageConfig = {
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

export const ESLIT_CONFIG: ESLintConfig = {
  env: {
    browser: true,
    node: true,
  },
  extends: ['plugin:vue/essential'],
  parserOptions: {
    parser: 'babel-eslint',
  },
  plugins: ['vue'],
  root: true,
  rules: {},
}

export const CONFIG_FILE_BUILD = `
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

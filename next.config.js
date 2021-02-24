/* eslint-disable @typescript-eslint/no-var-requires */
const { withPlugins } = require('next-compose-plugins')
const withImages = require('next-images')
const withNextEnv = require('next-env')
const dotenvLoad = require('dotenv-load')
const styledJSX = require(`styled-jsx/webpack`).loader

// * .env 파일을 불러옵니다.
dotenvLoad(process.env.NODE_ENV === 'production' ? 'production' : 'development')

const nextConfig = {
  // * 리액트 개발 중 사용할 환경변수들을 설정합니다.
  env: {
    // * 여기에 웹팩에 주입될 환경변수들을 입력합니다.
  },

  // * 이용자에게 제공되는 헤더에 nextjs 로 개발되었음을 노출하지 않습니다.
  poweredByHeader: false,

  // * 주소 뒤에 슬래시를 붙일지 여부입니다.
  trailingSlash: false,

  webpack: (config, { dev, defaultLoaders }) => {
    // * 개발 중 사용될 웹팩 설정입니다.
    if (dev) {
      // * HMR 시 CPU 사용량을 줄이는 빌드 최적화 코드입니다.
      config.watchOptions.poll = 1000
      config.watchOptions.aggregateTimeout = 300

      // * ESLint 를 활성화합니다.
      config.module.rules.push({
        test: /\.(ts|tsx|js|jsx)$/,
        enforce: 'pre',
        exclude: /node_modules/,
        use: [
          {
            loader: 'eslint-loader',
            options: {
              failOnError: true,
              emitWarning: true
            }
          }
        ]
      })
    }

    // * URL Loader 를 활성화합니다.
    config.module.rules.push({
      test: /\.(eot|woff|woff2|ttf|svg)$/,
      use: {
        loader: 'url-loader',
        options: {
          limit: 100000,
          name: '[name].[ext]'
        }
      }
    })

    // * Styled JSX 에 맞게끔 css 와 scss 를 불러옵니다.
    config.module.rules.push({
      test: /\.(css|scss|sass)$/,
      use: [
        defaultLoaders.babel,
        {
          loader: styledJSX,
          options: {
            type: (fileName, options) => {
              return options.query.type || 'global'
            }
          }
        },
        {
          loader: 'postcss-loader'
        },
        {
          loader: 'sass-loader'
        }
      ]
    })
    return config
  }
}

module.exports = withPlugins([withNextEnv, withImages], nextConfig)

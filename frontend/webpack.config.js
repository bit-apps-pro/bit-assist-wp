/* eslint-disable */

const path = require('path')
const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const WorkboxPlugin = require('workbox-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const safePostCssParser = require('postcss-safe-parser')
const svgToMiniDataURI = require('mini-svg-data-uri')
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin')


module.exports = (env, argv) => {
  const isProduction = argv.mode !== 'development'
  const { hot } = argv
  const appSlug = require('./package.json').name
  return {
    devtool: isProduction ? false : 'eval',
    entry: {
      index: path.resolve(__dirname, 'src/index.jsx'),
      [appSlug]: path.resolve(__dirname, 'src/resource/styles/global.scss'),
    },
    output: {
      filename: '[name].js',
      ...isProduction && { pathinfo: false },
      path: path.resolve(__dirname, '../assets/js/'),
      chunkFilename: isProduction ? '[name].js?v=[contenthash:6]' : '[name].js',
      library: `_${appSlug}`,
      libraryTarget: 'umd',
    },
    target: !isProduction ? 'web' : 'browserslist',
    ...hot && {
      devServer: {
        // publicPath: 'http://localhost:3000',
        hot: true,
        liveReload: false,
        port: 3000,
        // writeToDisk: true,
        headers: { 'Access-Control-Allow-Origin': '*' },
        // disableHostCheck: true,
      },
    },
    optimization: {
      runtimeChunk: 'single',
      splitChunks: {
        cacheGroups: {
          main: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors-main',
            chunks: chunk => chunk.name === 'index',
          },
          gutenbergBlock: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors-block',
            chunks: chunk => chunk.name === `${appSlug}-shortcode-block`,
          },
        },
      },
      minimize: isProduction,
      minimizer: [
        ...(!isProduction ? [] : [
          new TerserPlugin({
            terserOptions: { compress: { drop_console: true } },
            extractComments: {
              condition: true,
              filename: (fileData) => `${fileData.filename}.LICENSE.txt${fileData.query}`,
              banner: (commentsFile) => `Bit Apps license information ${commentsFile}`,
            },
          }),
          new OptimizeCSSAssetsPlugin({
            cssProcessorOptions: {
              parser: safePostCssParser,
              map: isProduction ? false : { inline: false, annotation: true },
            },
            cssProcessorPluginOptions: { preset: ['default', { minifyFontValues: { removeQuotes: false } }] },
          }),
        ]),
      ],
    },
    plugins: [
      new CleanWebpackPlugin(),
      new webpack.DefinePlugin({ 'process.env': { NODE_ENV: isProduction ? JSON.stringify('production') : JSON.stringify('development') } }),
      new MiniCssExtractPlugin({
        filename: '../css/[name].css?v=[contenthash:6]',
        ignoreOrder: true,
      }),
      // new CopyPlugin({
      //   patterns: [
      //     {
      //       from: path.resolve(__dirname, 'public/wp_index.html'),
      //       to: path.resolve(__dirname, '../views/view-root.php'),
      //     },
      //     {
      //       from: path.resolve(__dirname, 'manifest.json'),
      //       to: path.resolve(__dirname, '../assets/js/manifest.json'),
      //     },
      //     {
      //       from: path.resolve(__dirname, 'logo.svg'),
      //       to: path.resolve(__dirname, '../assets/img/logo.svg'),
      //     },
      //     {
      //       from: path.resolve(__dirname, 'redirect.php'),
      //       to: path.resolve(__dirname, '../assets/js/index.php'),
      //     },
      //   ],
      // }),
      ...(!hot ? [] : [new ReactRefreshWebpackPlugin({
        overlay: {
          sockIntegration: 'wds',
          sockHost: 'localhost',
          sockPort: 3000,
        },
      })]),
      ...(!isProduction ? [] : [
        new WorkboxPlugin.GenerateSW({
          clientsClaim: isProduction,
          skipWaiting: isProduction,
          dontCacheBustURLsMatching: /\.[0-9a-f]{8}\./,
          exclude: [/\.map$/, /asset-manifest\.json$/, /LICENSE/, /view-root.php/],
        })]),
    ],

    resolve: { extensions: ['.js', '.jsx', '.json', '.css'] },

    module: {
      strictExportPresence: true,
      rules: [
        {
          test: /\.(jsx?)$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
          // include: path.resolve(__dirname, 'src'),
          options: {
            presets: [
              [
                '@babel/preset-env',
                {
                  // useBuiltIns: 'entry',
                  // corejs: 3,
                  targets: {
                    browsers: !isProduction ? ['Chrome >= 88'] : ['>0.2%', 'ie >= 11'],
                  },
                  loose: true,
                },
              ],
              ['@babel/preset-react', { runtime: 'automatic' }],
            ],
            plugins: [
              '@babel/plugin-transform-runtime',
              ['@babel/plugin-transform-react-jsx', { runtime: 'automatic' }],
              ['@babel/plugin-proposal-class-properties', { loose: true }],
              ['@babel/plugin-proposal-private-methods', { loose: true }],
              ['@wordpress/babel-plugin-makepot', { output: path.resolve(__dirname, '/language/locale.pot') }],
              ...(!hot ? [] : ['react-refresh/babel']),
            ],
          },
        },
        {
          test: /\.(sa|sc|c)ss$/,
          exclude: /node_modules/,
          use: [
            // 'style-loader',
            {
              loader: MiniCssExtractPlugin.loader,
              options: { publicPath: '' },
            },
            { loader: 'css-loader' },
            {
              loader: 'postcss-loader',
              options: {
                postcssOptions: {
                  plugins: [
                    ['autoprefixer'],
                  ],
                },
              },
            },
            {
              loader: 'sass-loader',
              options: {
                sassOptions: {
                  ...isProduction && { outputStyle: 'compressed' },
                  ...!isProduction && { sourceMap: false },
                },
              },
            },
          ],
        },
        {
          test: /\.css$/,
          include: /node_modules/,
          use: ['style-loader', 'css-loader'],
        },
        {
          test: /\.svg$/i,
          use: [
            {
              loader: 'url-loader',
              options: {
                options: { generator: (content) => svgToMiniDataURI(content.toString()) },
                name: isProduction ? '[name][contenthash:8].[ext]' : '[name].[ext]',
                outputPath: '../img',
              },
            },
          ],
        },
        {
          test: /\.(jpe?g|png|gif|ttf|woff|woff2|eot)$/i,
          use: [
            {
              loader: 'url-loader',
              options: {
                limit: 3000,
                name: isProduction ? '[name][contenthash:8].[ext]' : '[name].[ext]',
                outputPath: '../img',
              },
            },
          ],
        },
      ],
    },
    // externals: {
    //   '@wordpress/i18n': {
    //     commonjs: ['wp', 'i18n'],
    //     commonjs2: ['wp', 'i18n'],
    //     amd: ['wp', 'i18n'],
    //     root: ['wp', 'i18n'],
    //   },
    // },
  }
}

require('dotenv').config()
const withSass = require('@zeit/next-sass')
const path = require('path')
const Dotenv = require('dotenv-webpack')
const withManifest = require('next-manifest')
const {resolve} = require('path')

const manifestConfig = {
    'short_name': 'InSync',
    'name': "InSync Team",
    'description': 'Time tracker app',
    'dir': 'ltr',
    'lang': 'en',
    icons: {
        src: resolve(process.cwd(), './assets/logo.png'),
        cache: true
    },
    'start_url': '/',
    'display': 'standalone',
    'theme_color': '#ffffff',
    'background_color': '#ffffff'
}

// module.exports = withManifest(withSass({
//     target: 'serverless',
//     manifest: manifestConfig,
//     webpack: config => {
//         config.module.rules.push({
//             test: /\.(eot|woff|woff2|ttf|svg|png|jpg|gif)$/,
//             use: {
//                 loader: 'url-loader',
//                 options: {
//                     limit: 100000,
//                     name: '[name].[ext]'
//                 }
//             }
//         })

//         config.plugins = config.plugins || []

//         config.plugins = [
//             ...config.plugins,

//             new Dotenv({
//                 path: path.join(__dirname, '.env'),
//                 systemvars: true
//             })
//         ]
//         return config
//     }
// }))


module.exports = withSass({
    webpack: config => {
        config.module.rules.push({
            test: /\.(eot|woff|woff2|ttf|svg|png|jpg|gif)$/,
            use: {
                loader: 'url-loader',
                options: {
                    limit: 100000,
                    name: '[name].[ext]'
                }
            }
        })

        config.plugins = config.plugins || []

        config.plugins = [
            ...config.plugins,

            new Dotenv({
                path: path.join(__dirname, '.env'),
                systemvars: true
            })
        ]
        return config
    }
})
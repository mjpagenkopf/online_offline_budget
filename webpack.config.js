const path = require('path');
const WebpackPwaManifest = require('webpack-pwa-manifest');

const config = {
    mode: 'production',
    entry: {
      main: path.resolve(__dirname, 'public/index.js),
    }  
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: '[name].[contenthash].js',
      assetModuleFilename: '[name][ext]',
      clean: true,
    },
    devtool: 'invline-source-map',
    devServer: {
      contentBase: path.resolve(__dirname, 'dist'),
      port: 8080, 
      open: true,
      hot: true,
      watchContentBase: true,
    },
  //loaders
      module: {
        rules: [
          //css
              { test: /\.css$/, use: ['style-loader', css-loader'] },
              //images
              { test: /\.(svg|ico|png|webp|jpg|gif|jpeg)$/, type: 'assist/resource' },
              //js for babel
              { 
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                  loader: 'babel-loader',
                  options: {
                    presets: ['@babel/preset-env'],
                  },
                }
              },
        ],
      },
        plugins: [
            new WebpackPwaManifest({
              inject: false,
              fingerprints: false,
              filename: "manifest.json",
              name: 'Budget Tracker',
              short_name: 'Budget Tracker',
              description: 'Take Your Budget on the Go',
              background_color: '#01579b',
              theme_color: '#ffffff',
              'theme-color': '#ffffff',
              start_url: '/',
              display: 'standalone',
              icons: [
                {
                  src: path.resolve("public/assets/icons/icon-192x192.png"),
                  sizes: [192, 512],
                  destination: path.join("assets", "icons")
                }
              ]
          }),
        ],
     })
};

module.exports = config;
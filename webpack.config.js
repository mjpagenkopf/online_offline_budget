const WebpackPwaManifest = require("webpack-pwa-manifest");
const path = require("path");

const config = {
  entry: './public/assets/js/index.js',  
  output: {
    path: __dirname + '/public/dist',
    filename: 'bundle.js',
  },
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
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
};

module.exports = config;
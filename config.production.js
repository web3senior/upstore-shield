const { merge } = require('webpack-merge')

module.exports = merge(require('./config.base.js'), {
  mode: 'production',
  watch: true,
  // We'll place webpack configuration for production environment here
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: [
          // Creates `style` nodes from JS strings
          "style-loader",
          // Translates CSS into CommonJS
          "css-loader",
          // Compiles Sass to CSS
          "sass-loader",
        ],
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[sha512:hash:base64:7].[ext]", //'[path][name].[ext]', // [hash]
              outputPath: "images",
            },
          },
        ],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: "asset/resource",
      },
    ],
  }
})

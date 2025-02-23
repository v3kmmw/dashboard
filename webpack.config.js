import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';  // Import the plugin

export default {
  entry: './src/main.tsx',
  output: {
    filename: 'bundle.js',
    path: path.resolve('dist'),
    publicPath: '/',  // Make sure to use '/' for relative paths in the HTML file
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  devServer: {
    static: {
      directory: path.resolve('dist'),  // Serve static files from the 'dist' folder
    },
    port: 8080,
    hot: true,
    historyApiFallback: true,  // Handle routing for single-page apps
    open: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',  // Your source HTML file
      filename: 'index.html',       // Output file in the 'dist' folder
    }),
  ],
  mode: 'development',
};

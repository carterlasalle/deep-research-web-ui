module.exports = {
  presets: [
    '@babel/preset-env',
    ['@babel/preset-react', { runtime: 'automatic' }],
    '@babel/preset-typescript',
  ],
  plugins: [
    '@babel/plugin-transform-runtime',
    '@babel/plugin-syntax-flow',
    ['@babel/plugin-transform-react-jsx', { runtime: 'automatic' }],
  ],
  env: {
    development: {
      plugins: ['react-refresh/babel'],
    },
  },
};
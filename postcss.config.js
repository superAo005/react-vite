module.exports = {
  // plugins: {
  //   'postcss-nested': {},
  //   tailwindcss: {},
  //   autoprefixer: {},
  // },
  plugins: [
    require('postcss-import'),
    require('tailwindcss/nesting'),
    require('tailwindcss'),
    require('autoprefixer'),
  ],
}

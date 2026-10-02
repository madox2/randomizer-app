module.exports = {
  root: true,
  extends: '@react-native-community',
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': 'error',
    quotes: ['error', 'single', {avoidEscape: true}],
    'comma-dangle': ['error', 'always-multiline'],
    semi: ['error', 'never'],
  },
}

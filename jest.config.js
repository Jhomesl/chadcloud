/**
 * @file Jest configuration
 * @author Lexus Drumgold <lex@lexusdrumgold.design>
 */

module.exports = {
  modulePaths: [
    '<rootDir>'
  ],
  roots: [
    '<rootDir>'
  ],
  testRegex: '(/(__tests__|tests)/.*|(\\.|/)(test|spec))\\.js?$',
  testPathIgnorePatterns: [
    '/node_modules/',
    '<rootDir>/tests/__mocks__/*'
  ],
  testURL: 'http://localhost:5000',
  verbose: true
}

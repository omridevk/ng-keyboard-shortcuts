import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:4200',
    supportFile: './src/support/index.ts',
    specPattern: './src/integration/*.spec.{js,jsx,ts,tsx}',
    videosFolder: '../../dist/cypress/apps/playground-e2e/videos',
    screenshotsFolder: '../../dist/cypress/apps/playground-e2e/screenshots',
    chromeWebSecurity: false,
    modifyObstructiveCode: false,
    fileServerFolder: '.',
    fixturesFolder: './src/fixtures'
  },
})

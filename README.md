# T485

[![Netlify Status](https://api.netlify.com/api/v1/badges/0643d0b2-6e9b-45a6-b71f-7d59a56fc293/deploy-status)](https://app.netlify.com/sites/t485/deploys)

Welcome to the BSA Troop 485 Website! This website runs on React and Gatsby. We alo
use storybook for developing components and component documentation.

### Getting Started

It is recommended (but not required) that you configure SSL for localhost (see below).
Then:

1. Install node and yarn, if not already installed. How you do this is up to you, but `nvm` is recommended.
2. Install dependencies: `$ yarn`
3. Start the dev server: `$ yarn start` If you haven't configured ssl yet, run `$ yarn start:nossl` instead.
   instead.

By default, `$ yarn start` will only start a gatsby dev server. However, a storybook server is also avaliable.
To start this, run `$ yarn storybook`, and to start both gatsby and storybook, run `$ yarn develop`

By default, gatsby runs on port 8000 and storybook on port 6006.

#### Building

To create a minimized production build, simple run gatsby build. Every file
in `src/pages` will become a page, and the generated storybook build will also be avaliable at
`/development/storybook`

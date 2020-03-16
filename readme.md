# T485

Welcome to the BSA Troop 485 Website! This website runs on React and Gatsby. We alo
use storybook for developing components and component documentation.

### Getting Started

It is recommended (but not required) that you configure SSL for localhost (see below).
Then:

1. Install node and yarn, if not already installed. How you do this is up to you, but `nvm` is recommended.
2. Install dependencies: `$ yarn`
3. Start the dev server: `$ yarn start` If you haven't configured ssl yet, run `$ yarn start:nossl` instead.
   instead.

Internally, both commands will start a gatsby development server (at default port 8000), and a storybook
server (at default port 6006) for you.

#### SSL

The easiest way to configure SSL is using `mkcert`, as follows.

1. Make sure you are in the same directory as the `t485` project. For example, if you downloaded
   `t485` to your downloads folder, CD to the t485 folder before doing continuing!
2. Install `mkcert` using `npm`: `$ npm i -g mkcert`
3. Setup `mkcert`'s certificate authority: `$ mkcert --install`
4. Create a local SSL certificate for t485 and localhost:
   `\$mkcert t485.org "\*.t485.org" t485.test localhost 127.0.0.1 ::1`

#### Building

To create a minimized production build, simple run gatsby build. Every file
in `src/pages` will become a page, and the generated storybook build will also be avaliable at
`/development/storybook`

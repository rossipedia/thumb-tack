# ![ThumbTack Icon](https://github.com/rossipedia/thumb-tack/raw/master/src/icon-32.png) ThumbTack

A Google Chrome extension that automatically pins tabs based on the URL

> This extension was heavily inspired by the [URL Pinner extension][1].
> Unfortunately it seems as though that extension is no longer compatible with
> the latest versions of Chrome, and I wanted an excuse to develop an extension.

## Usage

- Chrome: Install the extension from [here][2].
- Firefox: TBD

### Options

The options page is straightforward. Add a rule, select the matching behavior,
and then enter either a URL, domain, or regular expression to match against.

If a tab loads a URL that matches any of your rules, it will be automatically
pinned. If you later _unpin_ that tab, it will stay that way.

Options are stored via `chrome.storage.sync`, so they should sync to your Google
account across multiple Chrome installs.

### Force Pin

Clicking the extension icon will _force_ pin all tabs that match a rule,
even if that tab has previously been unpinned.

## Development

[Node.js](https://nodejs.org/en/) and [npm](https://www.npmjs.com) are required
for building this extension. Optionally, you can use [yarn](https://yarnpkg.com)
instead of npm.

This extension uses the following libraries at runtime:

- [ReactJS](https://reactjs.org)
- [Styled Components](https://www.styled-components.com/)
- [Immer](https://github.com/mweststrate/immer)

For development / building:

- [Babel](https://babeljs.io/)
- [Typescript](https://www.typescriptlang.org)
- [Webpack](https://webpack.js.org)

### Building the extension

1. Clone this repo
2. Run `yarn` or `npm install`
3. Run `yarn build` or `npm run build`

The extension output will be in `./dist`

### Running in dev mode

Running `yarn dev` or `npm run dev` will start up webpack in "watch" mode.
Changes to files in `./src` will be automatically re-compiled and bundled.


[1]: https://chrome.google.com/webstore/detail/url-pinner/lchefjdnocignejmkklgakfmnjhiimjh?utm_source=chrome-ntp-icon
[2]: https://chrome.google.com/webstore/detail/plkdbophokgibnhgphiamdpgamdcpcfc

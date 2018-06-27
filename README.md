# ![ThumbTack Icon](https://github.com/rossipedia/thumb-tack/raw/master/src/icon-32.png) ThumbTack

A Google Chrome extension that automatically pins tabs based on the URL

> This extension was heavily inspired by the [URL Pinner extension][1].
> Unfortunately it seems as though that extension is no longer compatible with
> the latest versions of Chrome, and I wanted an excuse to develop an extension.

## Usage

Install the extension from [here][2] (TODO).

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


[1]: https://chrome.google.com/webstore/detail/url-pinner/lchefjdnocignejmkklgakfmnjhiimjh?utm_source=chrome-ntp-icon
[2]: #

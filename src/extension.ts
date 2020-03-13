import {IOptions, shouldPin, getOptions} from './common';

const pinnedTabIds = new Set<number>();
const unpinnedTabIds = new Set<number>();

const pinTab = (tabId: number) => {
  chrome.tabs.update(tabId, {pinned: true});
  markTabAsPinned(tabId);
};

const markTabAsPinned = (tabId: number) => {
  pinnedTabIds.add(tabId);
  unpinnedTabIds.delete(tabId);
};

const markTabAsUnpinned = (tabId: number) => {
  console.log(`marking tab #${tabId} as manually unpinned`);
  pinnedTabIds.delete(tabId);
  unpinnedTabIds.add(tabId);
};

const getMatchingPinRule = (options: IOptions, url: string) => {
  const uri = new URL(url);
  return options.rules
    .filter(r => typeof r.value === 'string' && r.value.trim() !== '')
    .find(r => shouldPin(r, uri));
};

(async () => {
  let options = await getOptions();

  const getTab = (tabId: number) =>
    new Promise<chrome.tabs.Tab>(res => chrome.tabs.get(tabId, res));

  chrome.webNavigation.onDOMContentLoaded.addListener(async details => {
    if (options.rules.length == 0) {
      console.log(`no rules defined, aborting...`);
      return;
    }

    if (details.frameId !== 0) {
      return;
    }

    if (!details.tabId) {
      console.log(`No tabId from DOM loaded details.`);
      return;
    }

    const tab = await getTab(details.tabId);
    if (!tab) {
      throw new Error(`Unknown tab id: ${details.tabId}`);
    }

    console.log(`Got tab #${tab.id} with url ${tab.url}`);
    // Tab was already pinned
    if (tab.pinned) {
      console.log(`tab #${tab.id} is pinned, skipping...`);
      markTabAsPinned(tab.id);
      return;
    }

    // Something changed about this tab, but it's been manually
    // unpinned previously
    if (unpinnedTabIds.has(tab.id)) {
      console.log(`tab #${tab.id} was manually unpinned, skipping...`);
      return;
    }

    // If we get here, we care about this tab, check to see if
    // it should be pinned
    const matchingRule = getMatchingPinRule(options, tab.url);
    if (!!matchingRule) {
      console.log(`tab #${tab.id} matched rule: ${matchingRule.value}`);
      chrome.tabs.update(tab.id, {pinned: true});
      unpinnedTabIds.delete(tab.id);
      pinnedTabIds.add(tab.id);
    } else {
      console.log(
        `tab #${tab.id} didn't match any rules with url '${tab.url}'`,
      );
    }
  });

  chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.pinned === false) {
      markTabAsUnpinned(tabId);
    }
  });

  chrome.tabs.onRemoved.addListener(tabId => {
    console.log(`tab #${tabId} removed`);
    pinnedTabIds.delete(tabId);
    unpinnedTabIds.delete(tabId);
  });

  chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName === 'sync' && changes.options) {
      console.log('Got new options!');
      console.log(changes.options.newValue);
      options = changes.options.newValue;
    }
  });

  // Pin All action for when the user clicks on the extension icon
  chrome.browserAction.onClicked.addListener(() => {
    // Query all unpinned tabs, and force pin any that match
    chrome.tabs.query({pinned: false}, tabs => {
      tabs.forEach(tab => {
        if (!tab.url || tab.pinned) return;

        const matchingRule = getMatchingPinRule(options, tab.url);
        if (matchingRule) {
          // Force pin it
          console.log(`tab #${tab.id} matched rule ${matchingRule.value}`);
          pinTab(tab.id);
        }
      });
    });
  });
})();

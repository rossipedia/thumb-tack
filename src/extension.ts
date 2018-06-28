import { IOptions, shouldPin, getOptions } from './common';

const pinnedTabIds = new Set<number>();
const unpinnedTabIds = new Set<number>();

const pinTab = (tabId: number) => {
    chrome.tabs.update(tabId, { pinned: true });
    markTabAsPinned(tabId);
};

const markTabAsPinned = (tabId: number) => {
    pinnedTabIds.add(tabId);
    unpinnedTabIds.delete(tabId);
};

const markTabAsUnpinned = (tabId: number) => {
    pinnedTabIds.delete(tabId);
    unpinnedTabIds.add(tabId);
};

const getMatchingPinRule = (options: IOptions, url: string) => {
    const uri = new URL(url);
    return options.rules.find(r => shouldPin(r, uri));
};

(async () => {
    let options = await getOptions();

    chrome.storage.onChanged.addListener((changes, areaName) => {
        if (areaName === 'sync' && changes.options) {
            console.log('Got new options!');
            console.log(changes.options.newValue);
            options = changes.options.newValue;
        }
    });

    chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
        if (options.rules.length == 0) {
            console.log(`no rules defined, aborting...`);
            return;
        }

        if (changeInfo.pinned === false) {
            markTabAsUnpinned(tabId);
            return;
        }

        if (
            changeInfo.status &&
            changeInfo.status === options.updateEvent &&
            tab.url
        ) {
            // Tab was already pinned
            if (tab.pinned) {
                console.log(`tab #${tabId} is pinned, skipping...`);
                markTabAsPinned(tabId);
                return;
            }

            // Something changed about this tab, but it's been manually
            // unpinned previously
            if (unpinnedTabIds.has(tabId)) {
                console.log(`tab #${tabId} was manually unpinned, skipping...`);
                return;
            }

            // If we get here, we care about this tab, check to see if
            // it should be pinned
            console.log(`tab #${tabId}: ${changeInfo.status}`);
            const matchingRule = getMatchingPinRule(options, tab.url);
            if (!!matchingRule) {
                console.log(
                    `tab #${tabId} matched rule: ${matchingRule.value}`,
                );
                chrome.tabs.update(tabId, { pinned: true });
                unpinnedTabIds.delete(tabId);
                pinnedTabIds.add(tabId);
            }
        }
    });

    chrome.tabs.onRemoved.addListener((tabId, removeInfo) => {
        console.log(`tab #${tabId} removed`);
        pinnedTabIds.delete(tabId);
        unpinnedTabIds.delete(tabId);
    });

    // Pin All action for when the user clicks on the extension icon
    chrome.browserAction.onClicked.addListener(() => {
        // Query all unpinned tabs, and force pin any that match
        chrome.tabs.query({ pinned: false }, tabs => {
            tabs.forEach(tab => {
                if (!tab.url || tab.pinned) return;

                const matchingRule = getMatchingPinRule(options, tab.url);
                if (matchingRule) {
                    // Force pin it
                    console.log(
                        `tab #${tab.id} matched rule ${matchingRule.value}`,
                    );
                    pinTab(tab.id);
                }
            });
        });
    });
})();

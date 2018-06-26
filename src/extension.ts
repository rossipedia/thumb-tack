import { shouldPin, getOptions } from './common';

// const seen = new Set<number>();
(async () => {
    let options = await getOptions();

    if (options.rules.length == 0) {
        console.log(`no rules defined, aborting...`);
        return;
    }

    chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
        if (
            changeInfo.status &&
            changeInfo.status == options.updateEvent &&
            tab.url
        ) {
            // if (seen.has(tabId)) {
            //     console.log(`tab #${tabId} has been seen already, skipping...`);
            //     return;
            // }
            if (tab.pinned) {
                console.log(`tab #${tabId} is pinned, skipping...`);
                return;
            }
            console.log(`tab #${tabId}: ${changeInfo.status}`);
            if (
                options.rules.some(rule => {
                    const result = shouldPin(rule, new URL(tab.url));
                    if (result) {
                        console.log(
                            `tab #${tabId} matches rule: ${rule.value}`,
                        );
                    }
                    return result;
                })
            ) {
                // Pin it!
                chrome.tabs.update(tabId, { pinned: true });
            }
        }
    });

    chrome.tabs.onRemoved.addListener((tabId, removeInfo) => {
        console.log(`Removing tab #${tabId} from seen list`);
        // seen.delete(tabId);
    });
})();

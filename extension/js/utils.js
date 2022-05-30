

async function unwhitelist(domain) {
    await chrome.storage.local.remove(domain);
}


const utils = {
    unwhitelist
}

export default utils;
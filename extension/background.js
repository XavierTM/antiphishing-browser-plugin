
const list = [
	'bizstandardnews.com',
	'bients.com',
	'breaking-cnn.com',
	'fox-news24.com',
	'globalresearch.ca'
]


const unsafeDomains = new Set(list);


function getMainDomain(url) {
	const hostname = new URL(url).hostname;

	// const parts = hostname.split('.');
	// const len = parts.length;
	// const domain = parts[len -2] + '.' + parts[len -1];

	// return domain.toLowerCase();

	return hostname.toString().toLowerCase();

}

async function isUrlSafe(url) {

	// if (url.indexOf('localhost') !== -1)
	// 	return false;

	const domain = getMainDomain(url);

	if (domain.indexOf('localhost') === 0)
		return true;

	url = btoa(url)

	try {

		const localSafe = await isDomainSafeLocally(domain);
		if (localSafe === true || localSafe === false) {
			console.log('Using cache...');
			return localSafe;
		}
	
		const response = await fetch(`http://localhost:8080/api/url/${url}`);
		const { safe } = await response.json();

		try {
			if (safe) {
				await whitelist(domain);
			} else {
				await blacklist(domain);
			}

		} catch (err) {
			console.error(err);
		}

		return safe;

	} catch (err) {
		console.error(err.toString());
		throw err;
	}

}



function getTabUrl(tabId) {

	return new Promise((resolve, reject) => {
		chrome.tabs.query({}, function(tabs) {

			for (let i in tabs) {

				const tab = tabs[i];

				if (tab.id == tabId) {
					resolve(tab.url)
					break;
				}
			}

			reject(new Error('Failed to get URL'));
		});
	})
}


async function isDomainSafeLocally(domain) {

	const data = await chrome.storage.local.get(domain);

	console.log(data);

	if (!data[domain])
		return  null;

	if (data[domain].blacklisted)
		return false;

	if (data[domain].whitelisted)
		return true;

	
	return null;

}


async function blacklist(domain) {
	console.log('blacklisted:', domain);
	await chrome.storage.local.set({ [domain]: { blacklisted: true } });
}

async function whitelist(domain) {
	console.log('whitelisted:', domain);
	await chrome.storage.local.set({ [domain]: { whitelisted: true } });
}


async function onUpdated(tabId, changeInfo) {

	if (changeInfo.status !== 'complete')
		return;

	console.log(changeInfo.status);

	const url = await getTabUrl(tabId);
	const urlIsSafe = await isUrlSafe(url);

	if (urlIsSafe)
		return;


	chrome.scripting.executeScript({
		target: {tabId, allFrames: true},
		files: ['blocked.js'],
	});
}



async function onMessageHandler(request, sender, sendResponse) {
	const eventType = request.event || request.eventType || request.eventName;


	let response;

	switch (eventType) {

		case 'whitelist':
			await whitelist(request.domain);
			break;

		default:
			break;
	}

	sendResponse(response);


  }


chrome.tabs.onUpdated.addListener(onUpdated);
chrome.runtime.onMessage.addListener(onMessageHandler);

// import UTILS from 'js/utils';

async function init() {

    try {
        // retrieving items
        const domains = await chrome.storage.local.get(null);
        const whitelist = [], blacklist = [];

        // organizing items
        for (let hostname in domains) {

            const obj = domains[hostname];

            if (obj.whitelisted)
                whitelist.push(hostname)
            else if (obj.blacklisted)
                blacklist.push(hostname);

        }

        // adding items to UI
        if (whitelist.length > 0) {

            emptyElementById('div-whitelist');

            for (let i in whitelist)
                addWhiteListDomainToUI(whitelist[i]);
        }

        if (blacklist.length > 0) {

            emptyElementById('div-blacklist');
            
            for (let i in blacklist)
                addBlackListDomainToUI(blacklist[i]);
        }

        
        // add event listeners to buttons for unlisting
        const removeFromWhitelistButtons = Array.from(document.querySelectorAll('button.unlist'));

        removeFromWhitelistButtons.forEach(btn => {
            btn.addEventListener('click', unlist)
        });

    } catch (err) {

        showError(err);
    }


    // add eventlistener to blacklist this site
    document.getElementById('btn-blacklist-this-site').addEventListener('click', blacklistThisSite);

}


function getMainDomain(url) {
	const hostname = new URL(url).hostname;

	// const parts = hostname.split('.');
	// const len = parts.length;
	// const domain = parts[len -2] + '.' + parts[len -1];

	// return domain.toLowerCase();

	return hostname.toString().toLowerCase();

}


async function blacklistThisSite() {

    try {
        // get current url
        const tab = await getCurrentTab();
        if (!tab)
            return;

        // get domain
        const { url } = tab;
        const domain = getMainDomain(url);

        // store
        await chrome.storage.local.set({ [domain]: { blacklisted: true }});
        // window.location.reload();

        await fetch('http://localhost:8080/api/blacklist', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({ domain })
        });

    } catch (err) {
        showError(JSON.stringify(err, Object.getOwnPropertyNames(err)));
    }

}

function addWhiteListDomainToUI(domain) {
    addDomainToUI(domain, 'div-whitelist')
}

function addBlackListDomainToUI(domain) {
    addDomainToUI(domain, 'div-blacklist')
}


function addDomainToUI(domain, parentId) {

    const html = `<div class="domain" data-domain="${domain}">
        <span class="name">
            ${domain}
        </span>

        <div>
            <button class="btn-small red truncate unlist" data-domain="${domain}">
                <i class="material-icons">delete</i>
            </button>
        </div>
    </div>`;

    document.getElementById(parentId).innerHTML += html;

}


async function unlist(event) {
    
    const target = event.currentTarget;
    const domain = target.getAttribute('data-domain');

    await chrome.storage.local.remove(domain);

    window.location.reload();
}

function showError(err) {
    document.getElementById('div-error').innerHTML += '<br>' + String(err);
}


function emptyElementById(id) {
    try {
        document.getElementById(id).innerHTML = '';
    } catch (err) {
        console.log(err);
    }
}

async function getCurrentTab() {
    let queryOptions = { active: true, lastFocusedWindow: true };
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab;
  }

init();

// showError('After INIT')
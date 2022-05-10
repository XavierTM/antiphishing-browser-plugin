






// function getZIndex(elem) {

// 	let zIndex;

// 	try {
// 		zIndex = getComputedStyle(elem).zIndex;
// 	} catch (err) {
// 		zIndex = 'auto';
// 	}

// 	if (typeof zIndex !== 'number')
// 		zIndex = -200000;

// 	return zIndex;

// }


// function getMaxZIndex(elem) {

// 	const myZ = getZIndex(elem);
// 	let maxZ = myZ;

// 	if (elem.children) {

// 		for (let i in elem.children) {
// 			const childZ = getMaxZIndex(elem.children[i]);

// 			if (childZ > maxZ)
// 				maxZ = childZ;
// 		}
// 	}

// 	return maxZ;
// }


function whitelist() {
	localStorage.setItem(whitelist_key, true);
	div.style.display = 'none';
}


function isWhiteListed() {
	if (localStorage.getItem(whitelist_key))
		return true;
	return false;
}


var div = document.createElement('div');

div.innerHTML = 'This webiste looks like a scam.';
div.setAttribute('id', 'xavisoft-digital');
div.style.textAlign = 'center';
div.style.fontSize = '24px';
div.style.padding = '20px';
div.style.margin = '-1px';
div.style.border = '1px solid';
div.style.color = 'white';
div.style.background = 'red';
div.style.zIndex = 2147483646;
// div.style.width = '100%';
div.borderRadius = 2;
div.style.position = 'fixed';
div.style.top = 0;
div.style.left = 0;
div.style.right = 0;


const button = document.createElement('button');
button.innerHTML = 'I TRUST IT';
button.style.color = 'red';
button.style.background = 'white';
button.style.borderStyle = 'none';
// button.style.height = '16px';
button.style.fontSize = '16px'
button.style.padding = '10px';
button.style.marginLeft = '20px';
button.style.cursor = 'pointer';
button.addEventListener('click', whitelist);

div.append(button);



// security risk, please reconsider
const whitelist_key = 'polite-muzhiki-anti-phisher';
if (!isWhiteListed()) {
	document.innerHTML = '';
	document.body.prepend(div);
}



// console.log({ whitelist_key })

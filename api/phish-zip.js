
const PriorityQueue = require('./PriorityQueue');
const BinaryTreeNode = require('./BinaryTreeNode');
const axios = require('axios');



function getHuffmanCodes(node, prefix='') {

	// console.log('prefix:', prefix);

	const codeTable = {};
	let leftCodeTable = {}, rightCodeTable = {};

	if (node.left || node.right) {
		// non-leaf node
		if (node.left) {
			const leftPrefix = prefix + '0';
			leftCodeTable = getHuffmanCodes(node.left, leftPrefix);
		}

		if (node.right) {
			const rightPrefix = prefix + '1';
			rightCodeTable = getHuffmanCodes(node.right, rightPrefix);
		}

		const codeTable = { ...rightCodeTable, ...leftCodeTable };
		return codeTable;


	} else {
		// leaf node
		const object = {}
		const xter = node.data.xter;
		object[xter] = prefix;
		return object;
	}

	
}


function createFrequencyTable(str) {

	const freqTable = {};

	for (let i in str) {
		const xter =  str[i];
		const count = (freqTable[xter] || 0) + 1;
		freqTable[xter] = count;
	}

	return freqTable;
}

function createHuffmanTree(freqTable) {

	// create a priority queue
	const queue = new PriorityQueue();

	for (let xter in freqTable) {

		const frequency = freqTable[xter];

		const item = {	xter, frequency }
		const node = new BinaryTreeNode(item);

		const  priority = 1000 - frequency;
		queue.push(priority, node)
	}


			// const allQueued = queue.getAllOfThem();
			// console.log(allQueued.map(item => item.data.frequency).join(' '));

	// create a tree from that queue
	let notFinished = true;

	while(notFinished) {

		const first = queue.pop();
		const second = queue.pop();

		if (first) {

			if (queue.size() === 0) {
				notFinished = false;
			}

			const frequency = first.data.frequency + (((second || {}).data || {}).frequency || 0);
			const item = { frequency };
			const node = new BinaryTreeNode(item, first, second);
			const priority = 1000 - frequency;
			queue.push(priority, node);

		} else {
			notFinished = false
		}
	}

	return queue.pop();

	return huffManCodes;

}


function compressString(payload, dict=(new Set)) {

	// preprocess payload
	payload = String(payload).toLowerCase(); // make everything lowercase
	payload = payload.replace(/[^0-9a-zA-z]+/g, ' '); // make everything non-alphanumeric a space

	// compressing
	/// create freqTable
	const tokens = payload.split(' ');
	const freqTable = [];

	for (let i in tokens) {
		const token = tokens[i]
		if (dict.has(token))
			freqTable[token] = 2;
		else
			freqTable[token] = 1;
	}

	/// get codes
	const huffmanTree = createHuffmanTree(freqTable);
	const codeTable = getHuffmanCodes(huffmanTree);

	return tokens.map(token => codeTable[token]).join('')

}


function getCompressionRatio(str, dict) {
	const compressed = compressString(str, dict);
	return 100 - (compressed.length / str.length) * 100;
}


const legitDictionary = new Set([ 'affordable', 'reliable' ]);
const maliciousDictionary = new Set([ 'cheap', 'free' ]);

async function assess(url) {

	// fetch data
	const response = await axios.get(url);
	const html = response.data;

	// assess
	const legitRatio = getCompressionRatio(html, legitDictionary);
	const maliciousRatio = getCompressionRatio(html, legitDictionary);

	console.log({ legitRatio, maliciousRatio });

	let safe;

	if (legitRatio > maliciousRatio)
		safe = true;
	else
		safe = false;

	return { safe };

}



module.exports = {
	assess
}
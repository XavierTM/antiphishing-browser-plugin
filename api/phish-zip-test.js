
class PriorityQueue {

	push(priority, item) {
		const object = { priority: parseInt(priority) || 0, item }
		this.array.push(object);

		// sort
		this.array.sort(function (a, b) {
			if (a.priority > b.priority) 
				return -1;
			else if (a.priority < b.priority)
				return 1;
			else
				return 0;
		});

	}


	size() {
		return this.array.length;
	}

	getAllOfThem() {
		return this.array.map(item => item.item)
	}

	pop() {

		const object = this.array.shift();

		if (!object)
			return null;

		return object.item;
	}

	constructor() {
		this.array = []
	}
}


class BinaryTreeNode {

	constructor(data, left = null, right = null) {
		this.data = data;
		this.left = left;
		this.right = right;
	}
}


class BinaryTree {

	constructor(startNode) {
		this.startNode = startNode;
	}
}


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
	// console.log(codeTable);

	// const huffTable = [];

	// for (let xter in freqTable) {
	// 	huffTable.push({
	// 		xter,
	// 		freq: freqTable[xter],
	// 		code: codeTable[xter]
	// 	});
	// }


	// huffTable.sort((a, b) => {

	// 	if (a.freq > b.freq)
	// 		return -1;
	// 	else
	// 		return 0;
	// })

	// console.table(huffTable);

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


function main() {

	const legitDictionary = new Set([ 'affordable', 'reliable' ]);
	const maliciousDictionary = new Set([ 'cheap', 'free' ]);

	const legitWebpage = 'Welcome to X website, affordable and reliable hosting services. Our services are affordable and cheap affordable and cheap affordable and cheap affordable and cheap affordable and cheap';
	const maliciousWebpage = 'Welcome to X website, cheap and free hosting services. Our services are free and cheap free and cheap free and cheap free and cheap free and cheap free and cheap free and cheap free and cheap'

	const legitWebpageWithLegitDictionaryRatio = getCompressionRatio(legitWebpage, legitDictionary);
	const legitWebpageWithMaliciousDictionaryRatio = getCompressionRatio(legitWebpage, maliciousDictionary);
	const maliciousWebpageWithLegitDictionaryRatio = getCompressionRatio(maliciousWebpage, legitDictionary);
	const maliciousWebpageWithMaliciousDictionaryRatio = getCompressionRatio(maliciousWebpage, maliciousDictionary);
	
	console.log({
		legit: {
			legit: legitWebpageWithLegitDictionaryRatio,
			malicious: legitWebpageWithMaliciousDictionaryRatio
		},
		malicious: {
			legit: maliciousWebpageWithLegitDictionaryRatio,
			malicious: maliciousWebpageWithMaliciousDictionaryRatio
		}
	});

}

main();
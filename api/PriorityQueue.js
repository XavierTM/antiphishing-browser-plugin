
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


module.exports = PriorityQueue;
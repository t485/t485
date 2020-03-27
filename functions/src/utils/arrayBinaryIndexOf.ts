interface Array<T> {
	binaryIndexOf(value: T): number;
}

Array.prototype.binaryIndexOf = function(value: any): number {
	// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
	// @ts-ignore
	const arr = this; // eslint-disable-line @typescript-eslint/no-this-alias

	/**
	 * Copyright 2009 Nicholas C. Zakas. All rights reserved.
	 * MIT-Licensed
	 */
	let startIndex = 0,
		stopIndex = arr.length - 1,
		middle = Math.floor((stopIndex + startIndex) / 2);

	while (arr[middle] !== value && startIndex < stopIndex) {
		//adjust search area
		if (value < arr[middle]) {
			stopIndex = middle - 1;
		} else if (value > arr[middle]) {
			startIndex = middle + 1;
		}

		//recalculate middle
		middle = Math.floor((stopIndex + startIndex) / 2);
	}

	//make sure it's the right value
	return arr[middle] !== value ? -1 : middle;
};

export function getNumMonthsBetween(fromDateKey, toDateKey, inclusive = true) {
	if (fromDateKey === toDateKey && !inclusive) return 0;

	const [fromDate, toDate] = [new Date(fromDateKey), new Date(toDateKey)];
	const numMonths = toDate.getMonth() - fromDate.getMonth() + 12 * (toDate.getFullYear() - fromDate.getFullYear());
	return inclusive ? numMonths + 1 : numMonths - 1;
}

export function getDateKeysBetween(fromDateKey, toDateKey, inclusive = true) {
	if (new Date(toDateKey) < new Date(fromDateKey)) return [];

	const numMonths = getNumMonthsBetween(fromDateKey, toDateKey, false);
	const dateKeys = getNextDateKeys(fromDateKey, numMonths);
	return inclusive ? [fromDateKey].concat(dateKeys).concat([toDateKey]) : dateKeys;
}

export function getPrevDateKey(fromDateKey, step = 1) {
	const fromDate = new Date(fromDateKey);
	fromDate.setMonth(fromDate.getMonth() - step + 1, 0);
	return dateToDateKey(new Date(fromDate));
}

export function getNextDateKey(fromDateKey, step = 1) {
	const fromDate = new Date(fromDateKey);
	fromDate.setMonth(fromDate.getMonth() + step + 1, 0);
	return dateToDateKey(new Date(fromDate));
}

export function getNextDateKeys(fromDateKey, len) {
	const fromDate = new Date(fromDateKey);
	const range = Array.from(Array(len)).map((_, i) => i + 1);
	return range.map((num) => {
		const date = new Date(fromDate.getFullYear(), fromDate.getMonth() + num + 1, 0);
		const offset = date.getTimezoneOffset();
		return dateToDateKey(new Date(date.getTime() - offset * 60 * 1000));
	});
}

export function isValid(value) {
	return value === 'NaN' || (!isNaN(value) && value > 0);
}

export function dateToDateKey(date) {
	const newDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
	const year = newDate.getFullYear();
	const month = String(newDate.getMonth() + 1).padStart(2, '0');
	const day = String(newDate.getDate()).padStart(2, '0');
	const dateString = `${year}-${month}-${day}`;
	return dateString;
}

export function dateToString(date) {
	return date.toLocaleDateString('en-us', { year: 'numeric', month: 'long' });
}

import { useReducer } from 'react';
import {
	getNumMonthsBetween,
	getDateKeysBetween,
	getPrevDateKey,
	getNextDateKey,
	getNextDateKeys,
	isValid,
} from '../Util/Util';

const reducer = (state, action) => {
	switch (action.type) {
		case 'initialize': {
			return action.data;
		}

		case 'add': {
			const series = structuredClone(state.series);
			const lastDateKey = state.dateKeys[state.dateKeys.length - 1];
			const nextDateKeys = getNextDateKeys(lastDateKey, action.numOfCellsToAdd);
			const isEditing = state.activity.name === 'editing';

			nextDateKeys.map((nextDateKey) => (series[nextDateKey] = ''));

			return {
				dateKeys: [...state.dateKeys].concat(nextDateKeys),
				series: series,
				savedSeries: structuredClone(state.savedSeries),
				isRecentlySaved: false,
				lastDefaultDateKey: state.lastDefaultDateKey,
				errors: new Set(state.errors),
				history: [...state.history, state],
				activity: {
					name: 'editing',
					fromDateKey: isEditing ? state.activity.fromDateKey : nextDateKeys[0],
					toDateKey: nextDateKeys[nextDateKeys.length - 1],
				},
			};
		}

		case 'replace': {
			const series = structuredClone(state.series);
			const dateKeys = [action.startDate, ...getNextDateKeys(action.startDate, action.valuesAsReplacements.length - 1)];

			dateKeys.map((dateKey, index) => (series[dateKey] = action.valuesAsReplacements[index]));

			return {
				dateKeys: dateKeys,
				series: series,
				savedSeries: structuredClone(state.savedSeries),
				isRecentlySaved: false,
				lastDefaultDateKey: state.lastDefaultDateKey,
				errors: new Set(state.errors),
				history: [...state.history, state],
				activity: {
					name: 'replaced',
					fromDateKey: null,
					toDateKey: null,
				},
			};
		}

		case 'append': {
			const series = structuredClone(state.series);
			const lastDateKey = state.dateKeys[state.dateKeys.length - 1];
			const nextDateKeys = getNextDateKeys(lastDateKey, action.valuesToAppend.length);

			nextDateKeys.map((nextDateKey, index) => (series[nextDateKey] = action.valuesToAppend[index]));

			return {
				dateKeys: [...state.dateKeys].concat(nextDateKeys),
				series: series,
				savedSeries: structuredClone(state.savedSeries),
				isRecentlySaved: false,
				lastDefaultDateKey: state.lastDefaultDateKey,
				errors: new Set(state.errors),
				history: [...state.history, state],
				activity: {
					name: 'appended',
					fromDateKey: null,
					toDateKey: null,
				},
			};
		}

		case 'edit': {
			return {
				dateKeys: [...state.dateKeys],
				series: structuredClone(state.series),
				savedSeries: structuredClone(state.savedSeries),
				isRecentlySaved: false,
				lastDefaultDateKey: state.lastDefaultDateKey,
				errors: new Set(state.errors),
				history: [...state.history, state],
				activity: {
					name: 'editing',
					fromDateKey: state.activity.fromDateKey,
					toDateKey: state.activity.toDateKey,
				},
			};
		}

		case 'input': {
			const series = structuredClone(state.series);
			const errors = new Set(state.errors);

			const isEditing = state.activity.name === 'editing';
			const isSaving = state.activity.name === 'saving';
			const history = isEditing || isSaving ? [...state.history] : [...state.history, state];

			let value = action.value;
			if (value === '') value = 'NaN';
			if (parseInt(value)) value = parseInt(value);
			series[action.dateKey] = value;

			if (errors.has(action.dateKey) && isValid(series[action.dateKey])) errors.delete(action.dateKey);
			if (!isValid(series[action.dateKey])) errors.add(action.dateKey);

			return {
				dateKeys: [...state.dateKeys],
				series: series,
				savedSeries: structuredClone(state.savedSeries),
				isRecentlySaved: false,
				lastDefaultDateKey: state.lastDefaultDateKey,
				history: history,
				errors: errors,
				activity: {
					...state.activity,
					name: isSaving ? 'saving' : 'inputting',
				},
			};
		}

		case 'save': {
			const series = structuredClone(state.series);
			const isStandby = state.activity.name === 'standby';

			return {
				dateKeys: [...state.dateKeys],
				series: series,
				savedSeries: structuredClone(state.savedSeries),
				isRecentlySaved: state.isRecentlySaved,
				lastDefaultDateKey: state.lastDefaultDateKey,
				errors: new Set(state.errors),
				history: isStandby ? [...state.history] : [...state.history, state],
				activity: {
					name: 'saving',
					fromDateKey: state.activity.fromDateKey,
					toDateKey: state.activity.toDateKey,
				},
			};
		}

		case 'post-save': {
			let isOkayToSave = true;
			if (state.errors.size > 0) isOkayToSave = false;

			return {
				dateKeys: [...state.dateKeys],
				series: structuredClone(state.series),
				savedSeries: isOkayToSave ? structuredClone(state.series) : structuredClone(state.savedSeries),
				isRecentlySaved: isOkayToSave ? true : state.isRecentlySaved,
				lastDefaultDateKey: state.lastDefaultDateKey,
				errors: new Set(state.errors),
				history: [...state.history],
				activity: {
					name: isOkayToSave ? 'saved' : 'not saved',
					fromDateKey: null,
					toDateKey: null,
				},
			};
		}

		case 'select': {
			let fromDateKey = state.activity.fromDateKey;
			let toDateKey = state.activity.toDateKey;

			if (action.selectedDateKey) {
				if (fromDateKey === null) fromDateKey = action.selectedDateKey;
				else if (toDateKey == null && new Date(fromDateKey) >= new Date(action.selectedDateKey)) {
					toDateKey = fromDateKey;
					fromDateKey = action.selectedDateKey;
				} else if (new Date(fromDateKey) > new Date(action.selectedDateKey)) fromDateKey = action.selectedDateKey;
				else if (fromDateKey === action.selectedDateKey) {
					fromDateKey = toDateKey;
					toDateKey = null;
				} else if (toDateKey === action.selectedDateKey) toDateKey = null;
				else toDateKey = action.selectedDateKey;
			}

			return {
				dateKeys: [...state.dateKeys],
				series: structuredClone(state.series),
				savedSeries: structuredClone(state.savedSeries),
				isRecentlySaved: state.isRecentlySaved,
				lastDefaultDateKey: state.lastDefaultDateKey,
				errors: new Set(state.errors),
				history: [...state.history],
				activity: {
					name: 'selecting',
					fromDateKey: fromDateKey,
					toDateKey: toDateKey,
				},
			};
		}

		case 'cancel': {
			return {
				dateKeys: [...state.dateKeys],
				series: structuredClone(state.series),
				savedSeries: structuredClone(state.savedSeries),
				isRecentlySaved: state.isRecentlySaved,
				lastDefaultDateKey: state.lastDefaultDateKey,
				errors: new Set(state.errors),
				history: [...state.history],
				activity: {
					name: 'standby',
					fromDateKey: null,
					toDateKey: null,
				},
			};
		}

		case 'insert': {
			const series = structuredClone(state.series);
			const lastDateKey = state.dateKeys[state.dateKeys.length - 1];
			const fromDateKey = state.activity.fromDateKey;
			const toDateKey = state.activity.toDateKey;
			const numMonths = getNumMonthsBetween(fromDateKey, toDateKey);

			const appendedDateKeys = getNextDateKeys(lastDateKey, numMonths);
			let editingDateKeys = null;
			let newNextDateKeys = null;
			let [newFromDateKey, newToDateKey] = [fromDateKey, toDateKey];

			if (action.position === 'left') {
				editingDateKeys = getDateKeysBetween(fromDateKey, toDateKey);
				newNextDateKeys = getDateKeysBetween(toDateKey, lastDateKey).concat(appendedDateKeys);
				newNextDateKeys.reverse().forEach((dateKey) => (series[dateKey] = series[getPrevDateKey(dateKey, numMonths)]));
			} else {
				editingDateKeys = getNextDateKeys(toDateKey, numMonths);
				newNextDateKeys = getDateKeysBetween(getNextDateKey(toDateKey), lastDateKey).concat(appendedDateKeys);
				newNextDateKeys.reverse().forEach((dateKey) => (series[dateKey] = series[getPrevDateKey(dateKey, numMonths)]));
				[newFromDateKey, newToDateKey] = [editingDateKeys[0], editingDateKeys[numMonths - 1]];
			}
			editingDateKeys.map((dateKey) => (series[dateKey] = ''));

			return {
				dateKeys: [...state.dateKeys].concat(appendedDateKeys),
				series: series,
				savedSeries: structuredClone(state.savedSeries),
				isRecentlySaved: false,
				lastDefaultDateKey: state.lastDefaultDateKey,
				errors: new Set(state.errors),
				history: [...state.history, state],
				activity: {
					name: 'editing',
					fromDateKey: newFromDateKey,
					toDateKey: newToDateKey,
				},
			};
		}

		case 'delete': {
			const series = structuredClone(state.series);
			const lastDateKey = state.dateKeys[state.dateKeys.length - 1];
			const fromDateKey = state.activity.fromDateKey;
			const toDateKey = state.activity.toDateKey;
			const numMonths = getNumMonthsBetween(fromDateKey, toDateKey);
			const errors = new Set(state.errors);

			getDateKeysBetween(fromDateKey, lastDateKey).forEach((dateKey) => {
				const value = series[getNextDateKey(dateKey, numMonths)];
				if (value) series[dateKey] = value;
				else delete series[dateKey];
				errors.delete(dateKey);
			});

			return {
				dateKeys: [...state.dateKeys].slice(0, state.dateKeys.length - numMonths),
				series: series,
				savedSeries: structuredClone(state.savedSeries),
				isRecentlySaved: false,
				lastDefaultDateKey: state.lastDefaultDateKey,
				errors: errors,
				history: [...state.history, state],
				activity: {
					name: 'deleted',
					fromDateKey: null,
					toDateKey: null,
				},
			};
		}

		case 'undo': {
			const history = [...state.history];
			const prevTableData = history.pop();

			return {
				dateKeys: [...prevTableData.dateKeys],
				series: structuredClone(prevTableData.series),
				savedSeries: structuredClone(state.savedSeries),
				isRecentlySaved: false,
				lastDefaultDateKey: prevTableData.lastDefaultDateKey,
				errors: new Set(prevTableData.errors),
				history: history,
				activity: structuredClone(prevTableData.activity),
			};
		}

		default:
			return {
				dateKeys: [...state.dateKeys],
				series: structuredClone(state.series),
				savedSeries: structuredClone(state.series),
				isRecentlySaved: state.isRecentlySaved,
				lastDefaultDateKey: state.lastDefaultDateKey,
				errors: new Set(state.errors),
				history: [...state.history],
				activity: {
					name: 'standby',
					fromDateKey: null,
					toDateKey: null,
				},
			};
	}
};

export default function UseTableData() {
	const [tableData, dispatch] = useReducer(reducer, {});
	return [tableData, dispatch];
}

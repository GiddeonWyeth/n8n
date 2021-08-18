import * as rudderanalytics from 'rudder-sdk-js';

export function init() {
	rudderanalytics.ready(() => { console.log("we are all set!!!"); });
	rudderanalytics.load('1wfxw1YdRGrntY8intaq53hui51', 'localhost:8878');
	return rudderanalytics;
}
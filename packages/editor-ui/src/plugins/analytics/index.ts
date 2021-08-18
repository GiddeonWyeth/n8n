import _Vue from "vue";
import { IDataObject } from 'n8n-workflow';
import * as rudderStackAnalytics from './rudderstack';

declare module 'vue/types/vue' {
	interface Vue {
		$analytics: Analytics;
	}
}

export function AnalyticsPlugin(vue: typeof _Vue, options: IDataObject): void { // tslint:disable-line:no-any
	const analytics = new Analytics(options);
	Object.defineProperty(vue, '$analytics', {
		get() { return analytics; },
	});
	Object.defineProperty(vue.prototype, '$analytics', {
		get() { return analytics; },
	});
}

class Analytics {

	private analytics?: any; // tslint:disable-line:no-any

	constructor(options: IDataObject) {
		if(options.enabled) {
			this.analytics = rudderStackAnalytics.init();
		}
	}

	identify(event: string, properties?: IDataObject) {
		if (this.analytics) {
			this.analytics.identify(event, properties);
		}
	}

	track(event: string, properties?: IDataObject) {
		if (this.analytics) {
			this.analytics.track(event, properties);
		}
	}
}
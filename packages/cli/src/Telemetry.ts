//@ts-ignore
import * as rudderAnalytics from '@rudderstack/rudder-sdk-node';
import config = require('../config');

export class Telemetry {
	private client?: any;

	constructor() {
		const enabled = config.get('telemetry.enabled') as boolean;
		if (enabled) {
			this.client = new rudderAnalytics(config.get('telemetry.rudder.key') as string, `${config.get('telemetry.rudder.url')}/v1/batch`);
			this.client.identify({
				userId: '123456',
				traits: {
					name: 'Name Username',
					email: 'name@website.com',
					plan: 'Free',
					friends: 21
				}
			});
		}
	}
}

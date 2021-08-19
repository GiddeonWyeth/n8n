import {ICredentialType, INodeProperties, INodePropertyCollection, INodePropertyOptions, INodeType} from 'n8n-workflow';
import * as fs from 'fs';

const data = fs.readdirSync(__dirname);
data.forEach(async file => {
	if(!fs.lstatSync(`${__dirname}/${file}`).isDirectory()) return;
	let node: INodeType;
	try {
		const nodeDetails = await import(`./${file}/${file}.node.ts`);
		node = new nodeDetails[Object.keys(nodeDetails)[0]]();
	} catch (e) {
		return console.error(`Error for file ${file}`, e);
	}
	const parameters = node.description.properties.reduce((pv, cv) => ({
		...pv,
		[cv.name]: {
			name: formTranslation(cv.name),
			displayName: formTranslation(cv.displayName),
			description: formTranslation(cv.description),
			placeholder: formTranslation(cv.placeholder),
			options: (cv.options || []).reduce((options, option) => ({...options, ...handleOption(option)}), {}),
		},
	}), {});
	const credentials = await(node.description.credentials || []).reduce<Promise<object>>(async (pv, cv) => {
		const nodeCredsDetails = await import((`../credentials/${cv.name[0].toUpperCase()}${cv.name.slice(1)}.credentials`));
		const nodeCreds = new nodeCredsDetails[Object.keys(nodeCredsDetails)[0]]() as ICredentialType;
		return ({
			...(await pv),
			[cv.name]: nodeCreds.properties.reduce((credProps, prop) => ({
				...credProps,
				[prop.name]: {
					displayName: formTranslation(prop.displayName),
					description: formTranslation(prop.description),
				},
			}), {}),
		});
	}, Promise.resolve({}));

	fs.mkdirSync(`${__dirname}/${file}/translations`);
	fs.writeFileSync(
		`${__dirname}/${file}/translations/ru.ts`,
		`module.exports = ${JSON.stringify({ru: {[node.description.name]: {parameters, credentials}}})}`,
	);
	console.log(`Translation for ${file} created successfully`);
});

function formTranslation(str?: string): string | undefined {
	return str ? `Translation for ${str}` : undefined;
}

function handleOption(option: INodePropertyOptions | INodeProperties | INodePropertyCollection) {
	if ((option as INodePropertyOptions).value) {
		return {
			[(option as INodePropertyOptions).value]: {
				displayName: formTranslation(option.name),
				description: formTranslation((option as INodePropertyOptions).description),
			},
		};
	}

	return {
		[option.name]: {
			displayName: formTranslation((option as INodeProperties).displayName),
			description: formTranslation((option as INodeProperties).description),
		},
	};

	//TODO: AwsRekognition.node, Mqtt.node
}

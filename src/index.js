const PATHNAME_MAPS = {
	api: [
		/^\/alphacrm\.php$/,
		/^\/index\.test\.php$/,
		/^\/proxy\.php$/,
		/^\/api\//,
		/^\/ajax\//,
		/^\/c1\//,
		/^\/order\//,
		/^\/sms\//,
		/^\/software\//,
		/^\/_work\//,
		/^\/mailgun\/webhook/,
	],
	cabinet: [/^\/account\//, /^\/backend\//, /^\/panel(\/.*)?$/, /^\/panel$/, /^\/[a-z]{2}\/panel(\/.*)?$/],
};

const HOSTNAME_MAPS = {
	landing: 'test1.com',
	api: 'test2.com',
	cabinet: 'test3.com',
};

const resolveTargetType = (pathname) => {
	if (PATHNAME_MAPS.api.some((regex) => regex.test(pathname))) return 'api';
	if (PATHNAME_MAPS.cabinet.some((regex) => regex.test(pathname))) return 'cabinet';
	return 'landing';
};

export default {
	async fetch(request, env, ctx) {
		const url = new URL(request.url);
		const targetType = resolveTargetType(url.pathname);
		const targetHostname = HOSTNAME_MAPS[targetType];

		url.hostname = targetHostname;

		const modifiedRequest = new Request(url, {
			method: request.method,
			headers: request.headers,
			body: request.method !== 'GET' && request.method !== 'HEAD' ? await request.blob() : undefined,
		});

		const response = await fetch(modifiedRequest);

		return new Response(response.body, {
			status: response.status,
			headers: {
				...Object.fromEntries(response.headers),
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Credentials': 'true',
				'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
			},
		});
	},
};

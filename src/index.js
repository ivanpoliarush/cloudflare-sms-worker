const PATHNAME_MAPS = {
	api: [
		/^\/alphacrm\.php$/,
		/^\/index\.test\.php$/,
		/^\/proxy\.php$/,
		/^\/api\//,
		/^\/ajax\//,
		/^\/c1\//,
		/^\/_work\//,
		/^\/mailgun\/webhook/,
		/^\/backend\//,
	],
	cabinet: [/^\/order\//, /^\/sms\//, /^\/software\//, /^\/account\//, /^\/panel(\/.*)?$/, /^\/panel$/, /^\/[a-z]{2}\/panel(\/.*)?$/],
};

const HOST_MAPS = {
	landing: 'localhost:3001', // Replace with your landing domain
	api: 'localhost:3002', // Replace with your API domain
	cabinet: 'localhost:3003', // Replace with your cabinet domain
};

const resolveTargetType = (pathname) => {
	if (PATHNAME_MAPS.api.some((regex) => regex.test(pathname))) {
		return 'api';
	}

	if (PATHNAME_MAPS.cabinet.some((regex) => regex.test(pathname))) {
		return 'cabinet';
	}

	return 'landing';
};

export default {
	async fetch(request) {
		const url = new URL(request.url);
		const targetType = resolveTargetType(url.pathname);
		const targetHostname = HOST_MAPS[targetType];

		url.host = targetHostname;

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

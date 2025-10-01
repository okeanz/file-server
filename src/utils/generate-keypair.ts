import fs from 'fs';
import crypto from 'crypto';

export const keygen = () => {

	if (!fs.existsSync('./keys')) fs.mkdirSync('./keys');

	const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
		modulusLength: 2048,
		publicKeyEncoding: {
			type: 'pkcs1',
			format: 'pem'
		},
		privateKeyEncoding: {
			type: 'pkcs1',
			format: 'pem'
		}
	});

	// Writing keys to files.
	fs.writeFileSync("./keys/private.key", privateKey, 'utf-8');
	fs.writeFileSync("./keys/public.key", publicKey, 'utf-8');
}
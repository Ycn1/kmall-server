
const crypto = require('crypto');
fn = (str)=>{
	const hmac = crypto.createHmac('sha256', 'sdjfkdsjfkdsfj2');
	hmac.update(str);
	return hmac.digest('hex');
}

module.exports = fn;
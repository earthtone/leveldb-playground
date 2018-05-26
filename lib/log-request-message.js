module.exports = logRequestMessage;
var chalk = require('chalk');

function logRequestMessage ({ method, headers, url}) {
	return `
🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥

${chalk.yellow(new Date().toISOString().replace(/[A-Z]/g, ' '))} 
${chalk.cyan('REQUEST:')} ${method} ${url}
${chalk.cyan('ORIGIN:')} ${headers.origin} 
${chalk.cyan('USER_AGENT:')} ${headers['user-agent']}	

🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥
	`;
}


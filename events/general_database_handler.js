async function data_handler(client, message) {
	if (message.guild) { client.functions.handleServerDatabase(client, message.guild); }
	else { client.functions.handleUserDatabase(client, message.author); }
}
module.exports = data_handler;
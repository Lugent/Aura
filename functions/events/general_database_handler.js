async function data_handler(client, message) {
	if (message.guild) { client.functions.create_server_data(client, message.guild); }
	else { client.functions.create_user_data(client, message.author); }
}
module.exports = data_handler;
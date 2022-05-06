async function data_handler(client, executor) {
	if (executor.guild) { client.functions.handleServerDatabase(client, executor.guild); }
	//else { client.functions.handleUserDatabase(client, executor.author); }
}
module.exports = data_handler;
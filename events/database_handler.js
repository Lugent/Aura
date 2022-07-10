async function data_handler(client, executor) {
	if (executor.guild) {
		client.functions.handleServerDatabase(client, executor.guild, executor.member);
	}
	
	let get_user = executor.author || executor.user;
	if (get_user) {
		client.functions.handleUserDatabase(client, get_user);
	}
}
module.exports = data_handler;
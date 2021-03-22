function messageLogger(client, message) {
	if (!client.toggleLogger) { return; }
	if (message.author.id === client.user.id) { return; }
	if (message.author.id === client.config.owner) { return; }
	if (!message.cleanContent) { return; }
	if (message.channel.type === "dm") {
		console.log("");
		console.log("<< LOGGER >>");
		console.log("Direct Message");
		console.log("Author: " + message.author.tag + " - " + message.author.id)
		console.log("Content: " + message.cleanContent)
		console.log("Date: " + message.createdAt.toString());
	}
	else if (message.channel.type === "text") {
		console.log("");
		console.log("<<< LOGGER >>>");
		console.log("Guild: " + message.guild.name + " - " + message.guild.id);
		console.log("Channel: #" + message.channel.name + " - " + message.channel.id);
		console.log("Author: " + message.author.tag + " - " + message.author.id)
		console.log("Content: " + message.cleanContent)
		console.log("Date: " + message.createdAt.toString());
	}
}
module.exports = messageLogger;
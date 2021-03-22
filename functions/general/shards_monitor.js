const chalk = require("chalk");
function shards_monitoring (client) {
	// Shards event
	client.on("shardError", (error, id) => {
		console.error(chalk.redBright("ERROR: ") + "A wild error appeared on a Shard!" + "\n", error);
	});

	client.on("shardReady", (id, uGuilds) => {
		console.log("Shard " + id + " is ready");
	});

	client.on("shardReconnecting", (id) => {
		console.log("Shard " + id + " is reconnecting...");
	});

	client.on("shardResume", (id, replayedEvents) => {
		console.log("Shard " + id + "'s connection resumed." + " (" + replayedEvents + " replayed events)");
	});

	client.on("shardDisconnect", (event, id) => {
		console.log(chalk.yellowBright("WARNING: ") + "Shard " + id + " was disconnected." + " " + event.code + " " + event.reason);
	});

	// Shard monitoring
	/*client.ws.shards.forEach(function (shard) {
		shard.on("close", (event) => {
			console.log(chalk.yellowBright("WARNING: ") + "Destroyed Shard " + shard.id + "." + " " + event.code + " " + event.reason);
		});
		
		shard.on("destroyed", () => {
			console.log(chalk.yellowBright("WARNING: ") + "Disconnected Shard " + shard.id + ".");
		});

		shard.on("resumed", () => {
			console.log("Resumed Shard " + shard.id + "'s connection.");
		});
		
		shard.on("ready", () => {
			console.log("Connecting Shard " + shard.id + "...");
		});
		
		shard.on("allReady", () => {
			console.log("Connected Shard " + shard.id + ".");
		});
	});*/
}
module.exports = shards_monitoring;
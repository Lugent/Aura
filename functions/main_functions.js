const Canvas = require("canvas");
const Discord = require("discord.js");

/**
 * @description CPU and RAM usage monitor
 * @param {Discord.Client} client 
 */
function resourceMonitor(client) {
	let previousTime = new Date().getTime();
	let previousUsage = process.cpuUsage();
	let lastUsage;
	setInterval(() => {
		let currentUsage = process.cpuUsage(previousUsage);
		previousUsage = process.cpuUsage();
		
		let currentTime = new Date().getTime();
		let timeDelta = (currentTime - previousTime) * 10;
		let { user, system } = currentUsage;
		lastUsage = { system: system / timeDelta, total: (system + user) / timeDelta, user: user / timeDelta };
		previousTime = currentTime;
		client.statsCPU = lastUsage;
		if (lastUsage.total > 200) { process.abort(); }
	}, 1000);
	setInterval(() => { if ((process.memoryUsage().rss / 1000000) > 512) { process.abort(); } }, 1000);
}

/**
 * @param {Discord.Client} client 
 */
async function autoSaveGame(client) { setInterval(() => { for (const id in client.uno_games) { if (client.uno_games[id].started) { client.uno_games[id].save(); } } }, 1000 * 30); }

/**
 *
 * @param {Number} length 
 */
function generateCode(length) {
	let result = "";
	let chars = "0123456789" + "abcdefghijklmnopqrstuvwxyz" + "ABCDEFGHIJKLMNOPQRSTUVWXYZ" + "-_.";
	for (var i = 0; i < length; i++) { result += chars.charAt(Math.floor(Math.random() * chars.length));}
	return result;
}

module.exports = {
	generateCode: generateCode,
	resourceMonitor: resourceMonitor,
	autoSaveGame: autoSaveGame
};
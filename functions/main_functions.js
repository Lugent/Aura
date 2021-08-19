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
		if (lastUsage.total > 170) { process.abort(); }
	}, 1000);
	setInterval(() => { if ((process.memoryUsage().rss / 1000000) > 512) { process.abort(); } }, 1000);
}

/**
 *
 * @param {Number} length 
 */
function generateCode(length) {
	let result = "";
	let chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_.";
	for (var i = 0; i < length; i++) { result += chars.charAt(Math.floor(Math.random() * chars.length));}
	return result;
}

/**
 * 
 * @param {Discord.Client} client 
 * @param {Canvas.Canvas} Canvas 
 * @param {Number} level_number
 * @returns {Canvas.Image}
 */
async function generateRankIcon(client, Canvas, level_number) {
	let rank_front_image;
	if (level_number > -1) {
		let image_index = (level_number / client.config.exp_level_max) * 60;
		rank_front_image = await Canvas.loadImage(process.cwd() + "/assets/images/ranking/rank_icon_" + Math.floor(image_index) + ".png");
	}
	return rank_front_image;
}

module.exports = {
	generateCode: generateCode,
	resourceMonitor: resourceMonitor,
	generateRankIcon: generateRankIcon
};
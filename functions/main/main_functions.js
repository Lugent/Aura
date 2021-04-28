
function resources_monitoring(client) {
	// CPU usage
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

	// RAM usage
	setInterval(() => { if ((process.memoryUsage().rss / 1000000) > 512) { process.abort(); } }, 1000);
}

function create_server_data(client, guild) {
	if (!guild) { return; }
	
	let get_server_settings = client.server_data.prepare("SELECT * FROM settings WHERE guild_id = ?;").get(guild.id);
	if (!get_server_settings) {
		try {
			client.server_data.prepare("INSERT INTO settings (guild_id, prefix, language) VALUES (?, ?, ?);").run(guild.id, client.config.default.prefix, client.config.default.language);
		}
		catch (error) {
			console.error("ERROR: " + "Cannot create settings for guild: " + guild.name + "\n", error);
		}
		finally {
			console.log("Created settings for guild: " + guild.name);
		}
	}
	
	let get_server_features = client.server_data.prepare("SELECT * FROM features WHERE guild_id = ?;").get(guild.id);
	if (!get_server_features) {
		try {
			client.server_data.prepare("INSERT INTO features (guild_id, disabled_functions, disabled_commands) VALUES (?, ?, ?);").run(guild.id, "", "");
		}
		catch (error) {
			console.error("ERROR: " + "Cannot create features for guild: " + guild.name + "\n", error);
		}
		finally {
			console.log("Created features for guild: " + guild.name);
		}
	}
}

function create_user_data(client, user) {
	if (!user) { return; }
	if (user.bot) { return; }
	
	let get_user_settings = client.user_data.prepare("SELECT * FROM settings WHERE user_id = ?;").get(user.id);
	if (!get_user_settings) {
		try {
			client.user_data.prepare("INSERT INTO settings (user_id, language) VALUES (?, ?)").run(user.id, client.config.default.language);
		}
		catch (error) {
			console.error("ERROR: " + "Cannot create settings for user: " + user.tag + "\n", error);
		}
		finally {
			console.log("Created settings for user: " + user.tag);
		}
	}
}

// Status updater
function status_update(client) {
	let status_data = require(process.cwd() + "/configurations/activity.js");
    client.user.setPresence(status_data[getRandomNumber(status_data.length)]);
}

async function generateRankIcon(client, Canvas, level_number) {
	let level_table = client.config.exp_shield_table;
	let rank_front_image;
	let rank_back_image;
	let get_backlayer = level_table.find(level_table_index => level_number >= level_table_index.level);
	if (get_backlayer) {
		rank_back_image = await Canvas.loadImage(process.cwd() + "/assets/images/ranking/backlayer/rank_back_icon_" + get_backlayer.type + ".png");
	}
	
	if (level_number > -1) {
		rank_front_image = await Canvas.loadImage(process.cwd() + "/assets/images/ranking/frontlayer/rank_front_icon_" + (level_number % 60) + ".png");
	}
	
	if (level_number >= client.config.exp_level_max) {
		rank_front_image = await Canvas.loadImage(process.cwd() + "/assets/images/ranking/frontlayer/rank_front_icon_60.png");
	}
	return {rank_front_image: rank_front_image, rank_back_image: rank_back_image};
}

module.exports = {
	create_server_data: create_server_data,
	create_user_data: create_user_data,
	resources_monitoring: resources_monitoring,
	status_update: status_update,
	generateRankIcon: generateRankIcon,
};
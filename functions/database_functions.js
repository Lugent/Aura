const Discord = require("discord.js");

function checkServerSettings(client, guild) {
	if (!guild) { return; }
	if (!guild instanceof Discord.Guild) { return; }
	
	let get_data = client.server_data.prepare("SELECT * FROM settings WHERE guild_id = ?;").get(guild.id);
	if (!get_data) {
		try {
			client.server_data.prepare("INSERT INTO settings (guild_id, prefix, language) VALUES (?, ?, ?);").run(guild.id, process.env.DEFAULT_PREFIX, process.env.DEFAULT_LANGUAGE);
		}
		catch (error) {
			console.error("ERROR: " + "Cannot create settings for guild: " + guild.name + "\n", error);
		}
		finally {
			console.log("Created settings for guild: " + guild.name);
		}
	}
}

function checkServerFeatures(client, guild) {
	if (!guild) { return; }
	if (!guild instanceof Discord.Guild) { return; }
	
	let get_data = client.server_data.prepare("SELECT * FROM features WHERE guild_id = ?;").get(guild.id);
	if (!get_data) {
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

function checkMemberProfile(client, member) {
	if (!member) { return; }
	if (!member instanceof Discord.GuildMember) { return; }
	if (member.user.bot) { return; }

	let get_data = client.server_data.prepare("SELECT * FROM profiles WHERE guild_id = ? AND user_id = ?;").get(member.guild.id, member.user.id);
	if (!get_data) {
		try {
			client.server_data.prepare("INSERT INTO profiles (guild_id, user_id, credits, karma) VALUES (?, ?, ?, ?);").run(member.guild.id, member.user.id, 0, 0);
		}
		catch (error) {
			console.error("ERROR: " + "Cannot create server profile for member: " + member.user.tag + " - " + member.guild.name + "\n", error);
		}
		finally {
			console.log("Created server profile for member: " + member.user.tag + " - " + member.guild.name);
		}
	}
}

function checkMemberExp(client, member) {
	if (!member) { return; }
	if (!member instanceof Discord.GuildMember) { return; }
	if (member.user.bot) { return; }

	let get_data = client.server_data.prepare("SELECT * FROM exp WHERE guild_id = ? AND user_id = ?;").get(member.guild.id, member.user.id);
	if (!get_data) {
		try {
			client.server_data.prepare("INSERT INTO exp (guild_id, user_id, level, score, messages) VALUES (?, ?, ?, ?, ?);").run(member.guild.id, member.user.id, 1, 0, 0);
		}
		catch (error) {
			console.error("ERROR: " + "Cannot create server experience for member: " + member.user.tag + " - " + member.guild.name + "\n", error);
		}
		finally {
			console.log("Created server experience for member: " + member.user.tag + " - " + member.guild.name);
		}
	}
}

function checkUserProfile(client, user){
	if (!user) { return; }
	if (!user instanceof Discord.User) { return; }
	if (user.bot) { return; }

	let get_data = client.bot_data.prepare("SELECT * FROM profiles WHERE user_id = ?;").get(user.id);
	if (!get_data) {
		try {
			client.bot_data.prepare("INSERT INTO profiles (user_id, accent_colour, bio, gender, birthdate, birthdate_year) VALUES (?, ?, ?, ?, ?, ?);").run(user.id, null, null, null, null, null);
		}
		catch (error) {
			console.error("ERROR: " + "Cannot create profile for user: " + user.tag + "\n", error);
		}
		finally {
			console.log("Created profile for user: " + user.tag);
		}
	}
}

/**
 * 
 * @param {Discord.Client} client 
 * @param {Discord.Message|Discord.Interaction} executor
 */
function handleServerDatabase(client, executor, member) {
	if (!executor) { return; }
	
	checkServerSettings(client, executor);
	checkServerFeatures(client, executor);
	if (member) {
		checkMemberProfile(client, member);
		checkMemberExp(client, member);
	}
}

/**
 * 
 * @param {Discord.Client} client 
 * @param {Discord.Message|Discord.Interaction} executor
 */
function handleUserDatabase(client, executor) {
	if (!executor) { return; }
	
	checkUserProfile(client, executor);
}

module.exports = {
	handleServerDatabase: handleServerDatabase,
	handleUserDatabase: handleUserDatabase
};
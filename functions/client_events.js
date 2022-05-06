// Constants
const Discord = require("discord.js");

// Load event files
const command_executor = require(process.cwd() + "/events/command_executor.js"); 
const database_handler = require(process.cwd() + "/events/database_handler.js");
const experience_handler = require(process.cwd() + "/events/experience_handler.js");
const invite_tracker = require(process.cwd() + "/functions/invite_tracker.js");
const level_updater = require(process.cwd() + "/functions/experience_updater.js");

// Execute events
/**
 * 
 * @param {Discord.Client} client 
 */
module.exports = function (client) {
	client.on("interactionCreate", async (interaction) => {
		console.log(interaction);
		await database_handler(client, interaction);
		
		let blacklist_guild = interaction.guild ? client.bot_data.prepare("SELECT * FROM blacklist WHERE target_id = ? AND type = 'guild';").get(interaction.guild.id) : false;
		let blacklist_user = client.bot_data.prepare("SELECT * FROM blacklist WHERE target_id = ? AND type = 'user';").get(interaction.user.id);
		if (blacklist_guild || blacklist_user) {
			let blacklist_message = blacklist_user ? "You're blacklisted from the bot." : "The guild is blacklisted from the bot.";
			return interaction.reply({content: blacklist_message, ephemeral: true});
		}
		
		command_executor(client, interaction);
	});

	client.on("messageCreate", async (message) => {
		await database_handler(client, message);
		
		let blacklist_guild = message.guild ? client.bot_data.prepare("SELECT * FROM blacklist WHERE target_id = ? AND type = 'guild';").get(message.guild.id) : false;
		let blacklist_user = client.bot_data.prepare("SELECT * FROM blacklist WHERE target_id = ? AND type = 'user';").get(message.author.id);
		if (blacklist_guild || blacklist_user) { return; }
		
		command_executor(client, message);
		experience_handler(client, message);
	});

	client.on("inviteCreate", async (invite) => {
		await invite_tracker(client);
		if (invite.inviter) { console.log("Invite '" + invite.code + "' created, by '" + invite.inviter.tag + "' from '" + invite.guild.name + "'."); }
		else { console.log("Invite '" + invite.code + "' created, to '" + invite.guild.name + "'."); }
	});

	client.on("inviteDelete", async (invite) => {
		await invite_tracker(client);
		if (invite.guild.me.permissions.has(Discord.Permissions.FLAGS.VIEW_AUDIT_LOG)) {
			let audit_logs = await invite.guild.fetchAuditLogs({type: "INVITE_DELETE", limit: 1});
			let action_log = audit_logs.entries.first();
			if (action_log) {
				let {executor, target} = action_log;
				if (target && executor) { if (target.code === invite.code) { console.log("Invite code " + invite.code + " was deleted from " + invite.guild.name + " by " +  executor.tag); } }
				else { console.log("Invite code " + invite.code + " was deleted from " + invite.guild.name); }
			}
			else { console.log("Invite code " + invite.code + " was deleted from " + invite.guild.name); }
		}
	});

	client.on("guildMemberAdd", async (member) => {
		if (member.guild.me.permissions.has(Discord.Permissions.FLAGS.MANAGE_GUILD)) {
			//console.log(client.guild_invites);

			let get_guild = client.guild_invites.get(member.guild.id);
			//console.log(get_guild);
			await member.guild.invites.fetch().then(async (invites) => {
				let guild_invite = invites.find(invite => get_guild.get(invite.code) < invite.uses);
				if (guild_invite) {
					console.log("User " + member.user.tag + " joined " + member.guild.name);
					if (guild_invite.inviter) {
						let member_inviter = await client.users.fetch(guild_invite.inviter.id, true, true);
						invite_tracker(client);

						console.log("Using invite code " + guild_invite.code + " created by " + member_inviter.tag);
						console.log("Invite was used " + guild_invite.uses + " times.");
					}
					else { console.log("The invite wasn't found or was deleted."); }
				}
				else {
					if (!member.user.bot) { console.log("User " + member.user.tag + " joined to " + member.guild.name); }
				}
			});
		}
		else {
			console.log("User " + member.user.tag + " joined " + member.guild.name);
		}

		if (member.user.bot) {
			if (member.guild.me.permissions.has(Discord.Permissions.FLAGS.VIEW_AUDIT_LOG)) {
				let audit_logs = await member.guild.fetchAuditLogs({type: "BOT_ADD", limit: 1});
				let action_log = audit_logs.entries.first();
				if (action_log) {
					let {executor, target} = action_log;
					if (target.id === member.user.id) {
						console.log("Bot " + member.user.tag + " was added to " + member.guild.name + " by " + executor.tag);
					}
				}
			}
		}
	});

	client.on("guildMemberRemove", async (member) => {
		if (member.guild.me.permissions.has(Discord.Permissions.FLAGS.VIEW_AUDIT_LOG)) {
			let ban_audit_logs = await member.guild.fetchAuditLogs({type: "MEMBER_BAN_ADD", limit: 1});
			let ban_action_log = ban_audit_logs.entries.first();
			let ban_executor = ban_action_log ? ban_action_log.executor : null;
			let ban_target = ban_action_log ? ban_action_log.target : null;
			
			let kick_audit_logs = await member.guild.fetchAuditLogs({type: "MEMBER_KICK", limit: 1});
			let kick_action_log = kick_audit_logs.entries.first();
			let kick_executor = kick_action_log ? kick_action_log.executor : null;
			let kick_target = kick_action_log ? kick_action_log.target : null;
			
			if (ban_action_log && (ban_target.id === member.user.id)) {
				console.log(member.user.tag + " was banned from " + member.guild.name + " by " + ban_executor.tag);
			}
			else if (kick_action_log && (kick_target.id === member.user.id)) {
				console.log(member.user.tag + " was kicked from " + member.guild.name + " by " + kick_executor.tag);
			}
			else {
				if (member.user.bot) { console.log("Bot " + member.user.tag + " leaved from " + member.guild.name); }
				else { console.log(member.user.tag + " leaved from " + member.guild.name); }
			}
		}
		else {
			if (member.user.bot) { console.log("Bot " + member.user.tag + " leaved from " + member.guild.name); }
			else { console.log(member.user.tag + " leaved from " + member.guild.name); }
		}
	});

	client.on("guildCreate", async (guild) => {
		console.log("Joined to guild: " + guild.name);
		console.log("ID: " + guild.id);
		client.registerApplications(client);
		
		//await guild_join(client, guild);
		await invite_tracker(client);
	});

	client.on("guildDelete", async (guild) => {
		console.log("Leaved from guild: " + guild.name);
		console.log("ID: " + guild.id);
		
		await invite_tracker(client);
	});

	client.on("guildUnavailable", async (guild) => {
		if (guild.name) {
			console.log("Guild unavaliable: " + guild.name);
			console.log("ID: " + guild.id);
		}
	});

	client.on("ready", async () => {
		//setInterval(function() { if (client.connected) { console.log("Websocket latency: " + client.ws.ping + "ms."); } }, 120000);
		await invite_tracker(client);
		await level_updater(client);
		
		console.log("Registering applications to guilds...");
		await client.registerApplications(client);
		console.log("Everything is done and ready.");
	});

	client.on("Warning", (warning) => {
		console.log(chalk.yellowBright("WARNING:") + warning);
	});

	client.on("error", (error) => {
		console.log(chalk.redBright("ERROR:") + " Something failed");
		console.log(error);
	});

	client.on("invalidated", () => {
		console.log(chalk.greenBright("NOTICE:") + " Connection terminated; shutting down");
		process.exit();
	});
}
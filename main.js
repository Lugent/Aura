// Dependencies
const Discord = require("discord.js");
const chalk = require("chalk");

// Process handlers
process.on("unhandledRejection", (error) => { console.error(chalk.redBright("ERROR:") + " Unhandled promise rejection." + "\n", error); });

// Load variables
const dotenv = require("dotenv");
let dotenv_result = dotenv.config();
if (dotenv_result.error) { process.exit(); } else { console.log("Loaded enviroment variables."); }

// Client
const intents = Object.values(Discord.Intents.FLAGS).reduce((acc, p) => acc | p, 0);
const client = new Discord.Client({
	intents: intents,
	allowedMentions: {repliedUser: false}, 
	presence: {status: "invisible"},
	partials: ["MESSAGE", "CHANNEL", "REACTION", "USER", "GUILD_MEMBER"]
});

// Setup client
client.config = require(process.cwd() + "/configurations/client.js");
client.functions = {};

// Client main functions
let main_functions = require(process.cwd() + "/functions/main_functions.js");
client.functions.activityUpdater = main_functions.activityUpdater;
client.functions.resourceMonitor = main_functions.resourceMonitor;
client.functions.generateRankIcon = main_functions.generateRankIcon;

// Client database functions
let database_functions = require(process.cwd() + "/functions/database_functions.js");
client.functions.handleServerDatabase = database_functions.handleServerDatabase;
client.functions.handleUserDatabase = database_functions.handleUserDatabase;

// Client database functions
let number_functions = require(process.cwd() + "/functions/number_functions.js");
client.functions.getRandomNumber = number_functions.getRandomNumber;
client.functions.getRandomNumberRange = number_functions.getRandomNumberRange;
client.functions.getFormattedNumber = number_functions.getFormattedNumber;
client.functions.getOrdinalNumber = number_functions.getOrdinalNumber;

// Client time functions
let time_functions = require(process.cwd() + "/functions/time_functions.js");
client.functions.ISODateToJSDate = time_functions.ISODateToJSDate;
client.functions.generateDateString = time_functions.generateDateString;
client.functions.generateTimeString = time_functions.generateTimeString;
client.functions.generateDurationString = time_functions.generateDurationString;

// Client string functions
let string_functions = require(process.cwd() + "/functions/string_functions.js");
client.functions.getFormatedString = string_functions.getFormatedString;

// Client translator function
client.functions.getTranslation = require(process.cwd() + "/functions/translator_function.js");

// Client data
client.commands = new Discord.Collection();
client.cooldowns = new Discord.Collection();
client.exp_cooldowns = new Discord.Collection();
client.guild_invites = new Discord.Collection();

// Client states
client.last_msg = undefined;
client.status_updating = true;
client.connected = false; // don't change this

// Databases
let setupDatabases = require(process.cwd() + "/functions/database_setup.js");
setupDatabases(client);
console.log("Databases active.");

// Load event files
let command_executor = require(process.cwd() + "/events/command_executor.js"); 
let database_handler = require(process.cwd() + "/events/database_handler.js");
let guild_join = require(process.cwd() + "/events/guild_join.js");
let experience_handler = require(process.cwd() + "/events/experience_handler.js");
let afk_handler = require(process.cwd() + "/events/afk_handler.js");
let invite_tracker = require(process.cwd() + "/functions/invite_tracker.js");

// Execute events
client.on("interactionCreate", async (interaction) => {
	console.log(interaction);
	command_executor(client, interaction);
});

client.on("messageCreate", async (message) => {
	await database_handler(client, message);
	
	let blacklist_guild;
	let blacklist_user;
	if (message.guild) { blacklist_guild = client.bot_data.prepare("SELECT * FROM blacklist WHERE target_id = ? AND type = 'guild';").get(message.guild.id); }
	else { blacklist_user = client.bot_data.prepare("SELECT * FROM blacklist WHERE target_id = ? AND type = 'user';").get(message.author.id); }
	
	if (blacklist_guild || blacklist_user) { return; }
	
	afk_handler(client, message);
	command_executor(client, message);
	experience_handler(client, message);
});

client.on("inviteCreate", async (invite) => {
	await invite_tracker(client);
	if (invite.inviter) {
		console.log("Invite '" + invite.code + "' created, by '" + invite.inviter.tag + "' from '" + invite.guild.name + "'.");
	}
	else {
		console.log("Invite '" + invite.code + "' created, to '" + invite.guild.name + "'.");
	}
});

client.on("inviteDelete", async (invite) => {
	await invite_tracker(client);

	if (invite.guild.me.permissions.has("VIEW_AUDIT_LOG")) {
		let audit_logs = await invite.guild.fetchAuditLogs({type: "INVITE_DELETE", limit: 1});
		let action_log = audit_logs.entries.first();
		if (action_log) {
			let { executor, target } = action_log;
			if ((target) && (executor)) {
				if (target.code === invite.code) {
					console.log("Invite code " + invite.code + " was deleted from " + invite.guild.name + " by " +  executor.tag);
				}
			}
			else {
				console.log("Invite code " + invite.code + " was deleted from " + invite.guild.name);
			}
		}
		else {
			console.log("Invite code " + invite.code + " was deleted from " + invite.guild.name);
		}
	}
});

client.on("guildMemberAdd", async (member) => {
	var get_guild = client.guild_invites.get(member.guild.id);
	await member.guild.invites.fetch().then(async (invites) => {
		var guild_invite = invites.find(invite => get_guild.get(invite.code) < invite.uses);
		if (guild_invite) {
			console.log("User " + member.user.tag + " joined " + member.guild.name + "");
			if (guild_invite.inviter) {
				var member_inviter = await client.users.fetch(guild_invite.inviter.id, true, true);
				invite_tracker(client);

				console.log("Using invite code " + guild_invite.code + " created by " + member_inviter.tag);
				console.log("Invite was used " + guild_invite.uses + " times.");
			}
			else {
				console.log("The invite wasn't found or was deleted.");
			}
		}
		else {
			if (!member.user.bot) {
				console.log("User " + member.user.tag + " joined to " + member.guild.name);
			}
		}
	});

	if (member.user.bot) {
		if (member.guild.me.permissions.has("VIEW_AUDIT_LOG")) {
			let audit_logs = await member.guild.fetchAuditLogs({type: "BOT_ADD", limit: 1});
			let action_log = audit_logs.entries.first();
			if (action_log) {
				let { executor, target } = action_log;
				if (target.id === member.user.id) {
					console.log("Bot " + member.user.tag + " was added to " + member.guild.name + " by " + executor.tag);
				}
			}
		}
	}
});

client.on("guildMemberRemove", async (member) => {
	console.log(member.user.tag + " leaved from " + member.guild.name);
});

client.on("guildCreate", async (guild) => {
	console.log("Joined to guild " + guild.name);
	console.log("ID: " + guild.id);
	
	await guild_join(client, guild);
	await invite_tracker(client);
	await guild.commands.set(client.slash_commands.array()).then(async (command) => {
		console.log("");
		console.log("Registered slash commands.");
	}).catch(async (error) => {
		console.log("");
		console.error("Not added slash commands:" + "\n" + error.message);
	});
});

client.on("guildDelete", async (guild) => {
	console.log("Leaved from guild " + guild.name);
	console.log("ID: " + guild.id);
	
	await invite_tracker(client);
});

client.on("guildUnavailable", async (guild) => {
	if (guild.name) {
		console.log("Guild unavaliable: " + guild.name);
		console.log("ID: " + guild.id);
	}
});

// Verbose
const command_loader = require(process.cwd() + "/functions/command_loader.js");
const level_updater = require(process.cwd() + "/functions/experience_updater.js");
const constants = require(process.cwd() + "/configurations/constants.js");
async function run_bot() {
	console.log("Initializing functions...");
	await client.functions.resourceMonitor(client);
	
	console.log("Registering commands...");
	await command_loader(client);
	
	// Login
	let login_check = setInterval(function() {  if (!client.connected) { console.log(chalk.yellowBright("WARNING: ") + "The request is taking too long!"); } }, 10000);
	client.login(process.env.DISCORD_TOKEN).then(async () => {
		clearInterval(login_check);
		console.log("Connected to Discord!");
		
		console.log("Initializing invite tracker...");
		await invite_tracker(client);
		
		console.log("Executing level updater...");
		await level_updater(client);
		
		console.log("Registering slash commands...");
		let slash_commands = [];
		let client_commands = client.commands.array();
		for (let index = 0; index < client_commands.length; index++) {
			if ((client_commands[index].type & constants.cmdTypes.slashCommand) && (client_commands[index].slash_format)) {
				slash_commands.push(client_commands[index].slash_format);
			}
		}
		
		let count_added = 0;
		let count_failed = 0;
		let client_guilds = await client.guilds.fetch();
		let guilds_array = client_guilds.array();
		for (let guild_index = 0; guild_index < guilds_array.length; guild_index++) {
			let guild_element = await guilds_array[guild_index].fetch();
			await guild_element.commands.set(slash_commands).then(async (command) => { count_added++; }).catch(async (error) => { count_failed++; });
		}
		console.log("Registered in " + count_added + " guilds. (Not added in " + count_failed + " guilds).")
		
		console.log("Everything is ready!");
		console.log("Connected as " + client.user.tag);
		client.connected = true;
	}).catch((error) => {
		console.error(chalk.redBright("ERROR:") + " Failed to log in." + "\n", error);
		process.exit();
	});
	console.log("Connecting to Discord...");
}
run_bot();

client.on("ready", async () => {
	if (client.status_updating) { client.functions.activityUpdater(client); }
	setInterval(function() { if (client.status_updating) { client.functions.activityUpdater(client); }}, 20000);
	setInterval(function() { if (client.connected) { console.log("Websocket latency: " + client.ws.ping + "ms."); } }, 120000);
});

client.on("invalidated", () => {
	console.error(chalk.redBright("ERROR:") + " The actual connection was terminated.");
	process.exit();
});
// Dependencies
const Discord = require("discord.js");
const chalk = require("chalk");
const fs = require("fs");

// Process handlers
process.on("exit", (code) => {
	client.destroy();
	console.log("Process exit with code " + code);
});

process.on("unhandledRejection", error => {
	console.error(chalk.redBright("ERROR: ") + "Unhandled Rejection:" + "\n", error);
	if (client.last_msg) {
		let error_name = "Undefined Error";
		if (error instanceof EvalError) { error_name = "Evaluation Error"; }
		else if (error instanceof RangeError) { error_name = "Range Error"; }
		else if (error instanceof ReferenceError) { error_name = "Reference Error"; }
		else if (error instanceof SyntaxError) { error_name = "Syntax Error"; }
		else if (error instanceof TypeError) { error_name = "Type Error"; }
		else if (error instanceof Discord.DiscordAPIError) { error_name = "Discord API Error"; }
		
		let code_error = "";
		if (error instanceof Discord.DiscordAPIError) { code_error = " - " + error.httpStatus; }
		
		let embed = new Discord.MessageEmbed();
		embed.setDescription(":no_entry: " + "Unhandled Rejection");
		embed.addField(error_name + code_error, error.message || "");
		embed.setColor([255, 0, 0]);
		client.last_msg.send(embed);
		client.last_msg = undefined;
	}
});

// Load variables
const dotenv = require("dotenv");
let dotenv_result = dotenv.config();
if (dotenv_result.error) { process.exit(); } else { console.log("Loaded .env variables."); }

// Extensions
require(process.cwd() + "/functions/modules/ExtendedMessage.js");

// Client
const client = new Discord.Client({presence: {status: "invisible"}, fetchAllMembers: true, disableMentions: "everyone", http: {version: 7}});
client.config = require(process.cwd() + "/configurations/client.js");
client.functions = {};

// Client main functions
let main_functions = require(process.cwd() + "/functions/main/main_functions.js");
client.functions.activityUpdater = main_functions.activityUpdater;
client.functions.resourceMonitor = main_functions.resourceMonitor;
client.functions.generateRankIcon = main_functions.generateRankIcon;

// Client database functions
let database_functions = require(process.cwd() + "/functions/main/database_functions.js");
client.functions.handleServerDatabase = database_functions.handleServerDatabase;
client.functions.handleUserDatabase = database_functions.handleUserDatabase;

// Client database functions
let number_functions = require(process.cwd() + "/functions/main/number_functions.js");
client.functions.getRandomNumber = number_functions.getRandomNumber;
client.functions.getRandomNumberRange = number_functions.getRandomNumberRange;
client.functions.getFormattedNumber = number_functions.getFormattedNumber;
client.functions.getOrdinalNumber = number_functions.getOrdinalNumber;

// Client time functions
let time_functions = require(process.cwd() + "/functions/main/time_functions.js");
client.functions.ISODateToJSDate = time_functions.ISODateToJSDate;
client.functions.generateDateString = time_functions.generateDateString;
client.functions.generateTimeString = time_functions.generateTimeString;
client.functions.generateDurationString = time_functions.generateDurationString;

// Client string functions
let string_functions = require(process.cwd() + "/functions/main/string_functions.js");
client.functions.getFormatedString = string_functions.getFormatedString;

// Client translator function
client.functions.getTranslation = require(process.cwd() + "/functions/main/translator_function.js");

// Client data
client.commands = new Discord.Collection();
client.cooldowns = new Discord.Collection();
client.exp_cooldowns = new Discord.Collection();
client.guild_invites = new Discord.Collection();
client.guild_music = new Discord.Collection(); // {id: <snowflake>, music: <stream>, position: <integer>, is_playing: <boolean>, is_paused: <boolean>}

// Client states
client.last_msg = undefined;
client.toggle_logger = false;
client.status_updating = true;
client.connected = false; // don't change this

// Databases
let setupDatabases = require(process.cwd() + "/functions/main/database_setup.js");
try { setupDatabases(client); }
catch (error) {
	console.log(chalk.redBright("ERROR: ") + "Database failure, exiting program..." + "\n", error);
	process.exit();
}
finally { console.log("Databases active."); }

// Login
let login_check = setInterval(function() {  if (!client.connected) { console.log(chalk.yellowBright("WARNING: ") + "The login request is taking too long!"); } }, 10000);
client.login(process.env.DISCORD_TOKEN).then(() => {
	clearInterval(login_check);
	console.log("Connected to Discord, preparing functions...");
}).catch((error) => {
	console.error(chalk.redBright("ERROR: ") + "Cannot connect, exiting program..." + "\n", error);
	process.exit();
});
console.log("Connecting to discord...");

// Load event files
let general_command_executor = require(process.cwd() + "/functions/events/general_command_executor.js"); 
let general_data_handler = require(process.cwd() + "/functions/events/general_database_handler.js");
let guild_invite_tracker = require(process.cwd() + "/functions/main/invite_tracker.js");
let guild_member_join = require(process.cwd() + "/functions/events/guild_member_join.js");
let guild_msg_logger = require(process.cwd() + "/functions/events/general_message_logger.js");
let guild_bot_welcome = require(process.cwd() + "/functions/events/guilds_bot_welcome.js");
let guild_experience_handler = require(process.cwd() + "/functions/events/guilds_experience_handler.js");
let user_afk_handler = require(process.cwd() + "/functions/events/users_afk_handler.js");

// Execute events
client.on("message", async (message) => {
	await general_data_handler(client, message);
	
	let blacklist_guild;
	let blacklist_user;
	if (message.guild) { blacklist_guild = client.bot_data.prepare("SELECT * FROM blacklist WHERE target_id = ? AND type = 'guild';").get(message.guild.id); }
	else { blacklist_user = client.bot_data.prepare("SELECT * FROM blacklist WHERE target_id = ? AND type = 'user';").get(message.author.id); }
	
	if (blacklist_guild || blacklist_user) { return; }
	
	await guild_msg_logger(client, message);
	await user_afk_handler(client, message);
	await guild_experience_handler(client, message);
	await general_command_executor(client, message);
});

client.on("inviteCreate", async (invite) => {
	await guild_invite_tracker(client);
	if (invite.inviter) {
		console.log("Invite '" + invite.code + "' created, by '" + invite.inviter.tag + "' from '" + invite.guild.name + "'.");
	}
	else {
		console.log("Invite '" + invite.code + "' created, to '" + invite.guild.name + "'.");
	}
});

client.on("inviteDelete", async (invite) => {
	await guild_invite_tracker(client);
	if (invite.inviter) {
		console.log("Invite '" + invite.code + "' deleted, created by '" + invite.inviter.tag + "' from '" + invite.guild.name + "'.");
	}
	else {
		console.log("Invite '" + invite.code + "' deleted, from '" + invite.guild.name + "'.");
	}
});

client.on("guildMemberAdd", async (member) => {
	await guild_member_join(client, member);
});

client.on("guildMemberRemove", async (member) => {
	console.log(member.user.tag + " leaved from " + member.guild.name);
});

client.on("guildCreate", async (guild) => {
	await guild_bot_welcome(client, guild);
	await guild_invite_tracker(client);
});

client.on("guildDelete", async (guild) => {
	await guild_invite_tracker(client);
	console.log("Leaved guild " + "'" + guild.name + "'" + "." + " (" + guild.id + ")");
});

client.on("guildUnavailable", async (guild) => {
	console.log("Guild offline " + "'" + guild.name + "'" + "." + " (" + guild.id + ")");
});

// Verbose
let command_loader = require(process.cwd() + "/functions/main/command_loader.js");
let web_setup = require(process.cwd() + "/functions/main/web_setup.js");
client.on("ready", async () => {
	client.functions.resourceMonitor(client);
	if (client.status_updating) { client.functions.activityUpdater(client); }
	
	console.log("Registering commands...");
	await command_loader(client);
	
	console.log("Starting up webserver...");
	await web_setup(client);
	
	console.log("Initializing invite tracker...");
	await guild_invite_tracker(client);
	
	setInterval(function() { if (client.status_updating) { client.functions.activityUpdater(client); }}, 15000);
	setInterval(function() {
		if (client.connected) {
			let ping = client.ws.ping;
            let pingcolor = ping;
            if (ping > 330) { pingcolor = chalk.red(ping); }
            else if (ping > 225) { pingcolor = chalk.redBright(ping); }
            else if (ping > 140) { pingcolor = chalk.yellowBright(ping); }
            else if (ping > 75) { pingcolor = chalk.greenBright(ping); }
            else if (ping > 30) { pingcolor = chalk.cyanBright(ping); }
			console.log("Connection latency is " + pingcolor + "ms.");
		}
	}, 120000);
	
	client.connected = true;
	console.log("All functions ready.");
	console.log("Successfully connected as '" + client.user.tag + "'.");
});
client.on("invalidated", () => {
	console.error(chalk.redBright("ERROR: ") + "Invalid connection, exiting program...");
	process.exit();
});
client.on("error", (error) => { console.error(chalk.redBright("ERROR: "), error); });
client.on("warn", (warn) => { console.warn(chalk.yellowBright("WARNING: "), warn); });
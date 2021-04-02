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

// Client
const client = new Discord.Client({presence: {status: "invisible"}, fetchAllMembers: true, disableMentions: "everyone", http: {version: 7}});
client.config = require(process.cwd() + "/configurations/client.js");
client.functions = require(process.cwd() + "/functions/general/core.js");
client.crypt = require(process.cwd() + "/functions/general/crypto.js");
client.fetchers = require(process.cwd() + "/functions/general/fetchers.js");
client.commands = new Discord.Collection();
client.cooldowns = new Discord.Collection();
client.exp_cooldowns = new Discord.Collection();
client.guild_music = new Discord.Collection(); // {id: <snowflake>, music: <stream>, position: <integer>, is_playing: <boolean>, is_paused: <boolean>}
client.last_msg = undefined;
client.toggle_logger = false;
client.status_updating = true;
client.connected = false; // don't change this

// Client utilities
let translator = require(process.cwd() + "/functions/general/languages.js");
client.utils = { getTrans: translator.getTranslation }

// Databases
let setupDatabases = require(process.cwd() + "/functions/general/databases.js");
try { setupDatabases(client); }
catch (error) {
	console.log(chalk.redBright("ERROR: ") + "Database failure, exiting program..." + "\n", error)
	process.exit();
}
finally { console.log("Databases active."); }

// Login
let shards_monitoring = require("./functions/general/shards_monitor.js");
let login_check = setInterval(function() {  if (!client.connected) { console.log(chalk.yellowBright("WARNING: ") + "The login request is taking too long!"); } }, 10000);
client.login(process.env.DISCORD_TOKEN).then(() => {
	clearInterval(login_check);
	shards_monitoring(client);
	console.log("Connected to Discord, preparing functions...");
}).catch((error) => {
	console.error(chalk.redBright("ERROR: ") + "Cannot connect, exiting program..." + "\n", error);
	process.exit();
});
console.log("Connecting to discord...");

// Load event files
let command_executor = require(process.cwd() + "/functions/events/general_command_executor.js"); 
let data_handler = require(process.cwd() + "/functions/events/general_database_handler.js");
let msg_logger = require(process.cwd() + "/functions/events/general_message_logger.js");
let first_time_welcome = require(process.cwd() + "/functions/events/guilds_bot_welcome.js");
let exp_handler = require(process.cwd() + "/functions/events/guilds_experience_handler.js");
let afk_handler = require(process.cwd() + "/functions/events/users_afk_handler.js");

// Execute events
client.on("message", async (message) => {
	await data_handler(client, message);
	
	let blacklist_guild = undefined;
	let blacklist_user = undefined;
	if (message.guild) { blacklist_guild = client.bot_data.prepare("SELECT * FROM blacklist WHERE target_id = ? AND type = 'guild';").get(message.guild.id); }
	else { blacklist_user = client.bot_data.prepare("SELECT * FROM blacklist WHERE target_id = ? AND type = 'user';").get(message.author.id); }
	
	if ((blacklist_guild) && (blacklist_guild.active)) { return; }
	else if ((blacklist_user) && (blacklist_user.active)) { return; }
	
	await msg_logger(client, message);
	await afk_handler(client, message);
	await exp_handler(client, message);
	await command_executor(client, message);
});
client.on("guildCreate", async (guild) => {
	await first_time_welcome(client, guild);
});
client.on("guildDelete", async (guild) => {
	console.log("Leaved guild " + "'" + guild.name + "'" + "." + " (" + guild.id + ")");
});
client.on("guildUnavailable", async (guild) => {
	console.log("Guild offline " + "'" + guild.name + "'" + "." + " (" + guild.id + ")");
});

// Verbose
let command_loader = require(process.cwd() + "/functions/general/command_loader.js");
let web_setup = require(process.cwd() + "/functions/general/web_setup.js");
client.on("ready", async () => {
	client.functions.resources_monitoring(client);
	if (client.status_updating) { client.functions.status_update(client); }
	
	console.log("Registering commands...");
	await command_loader(client);
	
	console.log("Starting up webserver...");
	await web_setup(client);
	
	setInterval(function() { if (client.status_updating) { client.functions.status_update(client); }}, 15000);
	setInterval(function() {
		if (client.connected) {
			let ping = client.ws.ping;
            let pingcolor = ping //[254, 254, 254];
            if (ping > 330) { pingcolor = chalk.red(ping); }
            else if (ping > 225) { pingcolor = chalk.redBright(ping); }
            else if (ping > 140) { pingcolor = chalk.yellowBright(ping); }
            else if (ping > 75) { pingcolor = chalk.greenBright(ping); }
            else if (ping > 30) { pingcolor = chalk.cyanBright(ping); }
			console.log("Connection latency is " + pingcolor + "ms.");
		}
	}, 60000);
	
	client.connected = true;
	console.log("All functions ready.")
	console.log("Successfully connected as '" + client.user.tag + "'.");
});
client.on("invalidated", () => {
	console.error(chalk.redBright("ERROR: ") + "Invalid connection, exiting program...");
	process.exit();
});
client.on("error", (error) => { console.error(chalk.redBright("ERROR: "), error); });
client.on("warn", (warn) => { console.warn(chalk.yellowBright("WARNING: "), warn); });
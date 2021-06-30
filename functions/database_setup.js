const Discord = require("discord.js");
const SQLite = require("better-sqlite3");
const fs = require("fs");
if (!fs.existsSync("databases")) fs.mkdirSync("databases");
const data_bot = new SQLite(process.cwd() + "/databases/bot_data.sqlite");
const data_server = new SQLite(process.cwd() + "/databases/server_data.sqlite");
const data_user = new SQLite(process.cwd() + "/databases/user_data.sqlite");

/**
 * 
 * @param {Discord.Client} client 
 */
function setupDatabases(client) {
	/* BOT DATA */
	let table_bot_blacklist = data_bot.prepare("SELECT count(*) FROM sqlite_master WHERE type = 'table' AND name = 'blacklist';").get();
	if (!table_bot_blacklist["count(*)"]) {
		data_bot.prepare("CREATE TABLE blacklist (id INTEGER PRIMARY KEY AUTOINCREMENT, target_id TEXT, type TEXT, time NUMERIC, reason TEXT);").run();
		data_bot.prepare("CREATE UNIQUE INDEX blacklist_id ON blacklist (id);").run();
	}
	client.bot_data = data_bot;
	/* BOT DATA */
	
	/* SERVER DATA */
	// Warns
	let table_server_warn = data_server.prepare("SELECT count(*) FROM sqlite_master WHERE type = 'table' AND name = 'warns';").get();
	if (!table_server_warn["count(*)"]) {
		data_server.prepare("CREATE TABLE warns (id INTEGER PRIMARY KEY AUTOINCREMENT, guild_id TEXT, user_id TEXT, reason TEXT);").run();
		data_server.prepare("CREATE UNIQUE INDEX warn_id ON warns (id);").run();
	}
	
	// Level
	let table_server_level = data_server.prepare("SELECT count(*) FROM sqlite_master WHERE type = 'table' AND name = 'exp';").get();
	if (!table_server_level["count(*)"]) {
		data_server.prepare("CREATE TABLE exp (id INTEGER PRIMARY KEY AUTOINCREMENT, guild_id TEXT, user_id TEXT, level NUMERIC, score NUMERIC, messages NUMERIC);").run();
		data_server.prepare("CREATE UNIQUE INDEX level_id ON exp (id);").run();
	}
	
	// Features
	let table_server_features = data_server.prepare("SELECT count(*) FROM sqlite_master WHERE type = 'table' AND name = 'features';").get();
	if (!table_server_features["count(*)"]) {
		data_server.prepare("CREATE TABLE features (id INTEGER PRIMARY KEY AUTOINCREMENT, guild_id TEXT, disabled_functions TEXT, disabled_commands TEXT);").run();
		data_server.prepare("CREATE UNIQUE INDEX feature_id ON features (id);").run();
	}
	
	// Settings
	let table_server_settings = data_server.prepare("SELECT count(*) FROM sqlite_master WHERE type = 'table' AND name = 'settings';").get();
	if (!table_server_settings["count(*)"]) {
		data_server.prepare("CREATE TABLE settings (id INTEGER PRIMARY KEY AUTOINCREMENT, guild_id TEXT, prefix TEXT, language TEXT, starboard_channel TEXT);").run();
		data_server.prepare("CREATE UNIQUE INDEX setting_id ON settings (id);").run();
	}
	data_server.pragma("synchronous = 1");
	data_server.pragma("journal_mode = wal");
	client.server_data = data_server;
	/* SERVER DATA */
	
	/* USER DATA */
	// Afk
	let table_user_afk = data_user.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'afk';").get();
	if (!table_user_afk["count(*)"]) {
		data_user.prepare("CREATE TABLE afk (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id TEXT, name TEXT, reason TEXT, time NUMERIC);").run();
		data_user.prepare("CREATE UNIQUE INDEX afk_id ON afk (id);").run();
	}
	
	// Settings
	let table_user_settings = data_user.prepare("SELECT count(*) FROM sqlite_master WHERE type = 'table' AND name = 'settings';").get();
	if (!table_user_settings["count(*)"]) {
		data_user.prepare("CREATE TABLE settings (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id TEXT, language TEXT);").run();
		data_user.prepare("CREATE UNIQUE INDEX setting_id ON settings (id);").run();
	}
	
	// Tags
	let table_user_tags = data_user.prepare("SELECT count(*) FROM sqlite_master WHERE type = 'table' AND name = 'tags';").get();
	if (!table_user_tags["count(*)"]) {
		data_user.prepare("CREATE TABLE tags (id INTEGER PRIMARY KEY AUTOINCREMENT, author_id TEXT, name TEXT KEY, content TEXT, files TEXT, uses NUMERIC, creation_date NUMERIC);").run();
		data_user.prepare("CREATE UNIQUE INDEX tag_id ON tags (id);").run();
	}
	
	data_user.pragma("synchronous = 1");
	data_user.pragma("journal_mode = wal");
	client.user_data = data_user;
	/* USER DATA */
}
module.exports = setupDatabases;

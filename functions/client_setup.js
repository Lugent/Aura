// Consttants
const Discord = require("discord.js");
const constants = require(process.cwd() + "/configurations/constants.js");

// Setup client
module.exports = function (client) {
	client.config = require(process.cwd() + "/configurations/client.js");
	client.functions = {};
	client.uno_games = {};

	// Client main functions
	let main_functions = require(process.cwd() + "/functions/main_functions.js");
	client.functions.generateCode = main_functions.generateCode;
	client.functions.resourceMonitor = main_functions.resourceMonitor;
	client.functions.autoSaveGame = main_functions.autoSaveGame;

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
	client.functions.convertISODate = time_functions.convertISODate;
	client.functions.convertISOString = time_functions.convertISOString;
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
	client.application_cooldowns = new Discord.Collection();
	client.button_cooldowns = new Discord.Collection();
	client.select_cooldowns = new Discord.Collection();
	client.exp_cooldowns = new Discord.Collection();
	client.guild_invites = new Discord.Collection();
	client.credits_cooldowns = new Discord.Collection();

	// Databases
	let setupDatabases = require(process.cwd() + "/functions/database_setup.js");
	setupDatabases(client);

	// Slash Command
	// Translator
	function application_translate(application, guild) {
		application.description = client.functions.getTranslation(client, guild, "application_commands", application.description);
		if (application.options && application.options.length) { for (let index = 0; index < application.options.length; index++) { application_translate(application.options[index], guild); } }
		return application;
	}

	// Register
	client.registerApplications = async function (client) {
		let guilds_array = [];
		let client_guilds = await client.guilds.fetch();
		client_guilds.forEach(async function (guild) { guilds_array.push(guild); });
		for (let guild_index = 0; guild_index < guilds_array.length; guild_index++) {
			let client_commands = JSON.parse(JSON.stringify(client.commands));
			let applications_commands = [];
			for (let command_index = 0; command_index < client_commands.length; command_index++) {
				if ((client_commands[command_index].type & constants.cmdTypes.applicationsCommand) && (client_commands[command_index].applications)) {
					for (let index = 0; index < client_commands[command_index].applications.length; index++) {
						let	result_command = client_commands[command_index].applications[index].format;
						applications_commands.push(result_command);
					}
				}
			}
			for (let index = 0; index < applications_commands.length; index++) { if (applications_commands[index].type == "CHAT_INPUT") { application_translate(applications_commands[index], guilds_array[guild_index]); } }

			let guild_element = await guilds_array[guild_index].fetch();
			await guild_element.commands.set(applications_commands).catch(console.error);
		}
	};
	
	/* This new system of localizations in discord.js v13.7.x doesn't works, soo i'll keep the old system until figure it out */
	// Translator
	/*function application_translate(application) {
		let languages = [{source: "en", target: "en-US"}, {source: "en", target: "en-GB"}, {source: "es", target: "es-ES"}];
		let languages_definition = {};
		let languages_definition_name = {};
		for (let index = 0; index < languages.length; index++) {
			let get_name = client.functions.getTranslation(client, languages[index].source, "application_commands", application.name, null, true);
			let get_description = client.functions.getTranslation(client, languages[index].source, "application_commands", application.description, null, true);
			languages_definition_name[languages[index].target] = get_name.length ? get_name : application.name;
			languages_definition[languages[index].target] = get_description.length ? get_description : application.description;
		}
		
		application.nameLocalizations = languages_definition_name;
		application.descriptionLocalizations = languages_definition;
		if (application.options && application.options.length) {
			for (let index = 0; index < application.options.length; index++) {
				application_translate(application.options[index]);
			}
		}
		return application;
	}

	// Register
	client.registerApplications = async function (client) {
		let guilds_array = [];
		let client_guilds = await client.guilds.fetch();
		client_guilds.forEach(async function (guild) { guilds_array.push(guild); });
		
		let client_commands = [];
		client.commands.forEach((command) => { client_commands.push(command); })
		
		let applications_commands = [];
		for (let command_index = 0; command_index < client_commands.length; command_index++) {
			if ((client_commands[command_index].type & constants.cmdTypes.applicationsCommand) && (client_commands[command_index].applications)) {
				for (let index = 0; index < client_commands[command_index].applications.length; index++) {
					let	result_command = client_commands[command_index].applications[index].format;
					applications_commands.push(result_command);
				}
			}
		}
		
		for (let index = 0; index < applications_commands.length; index++) {
			if (applications_commands[index].type == "CHAT_INPUT") {
				application_translate(applications_commands[index]);
			}
		}
		
		console.log(applications_commands);
		for (let guild_index = 0; guild_index < guilds_array.length; guild_index++) {
			let guild_element = await guilds_array[guild_index].fetch();
			await guild_element.commands.set(applications_commands).catch(console.error);
		}
	};*/
}
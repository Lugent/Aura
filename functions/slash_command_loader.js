const constants = require(process.cwd() + "/configurations/constants.js");
const fs = require("fs");
const chalk = require("chalk");
const Discord = require("discord.js");

function isEmpty(obj) {
    if (obj == null) { return true; }
    if (obj.length > 0) { return false; }
    if (obj.length === 0) { return true; }
    if (typeof obj !== "object") { return true; }
    for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) return false; }
    return true;
}

/**
 * 
 * @param {Discord.Client} client 
 * @param {boolean} reload 
 */
async function slash_command_loader(client, reload = false) {
	if (reload) {
		console.log("");
		console.log("Unloading slash commands:");
		await client.slash_commands.forEach(async function(command) {
			let path = process.cwd() + "/" + client.config.slash_commands_dir + "/" + command.path + "/" + command.name + ".js";
			delete require.cache[require.resolve(path)];
			await client.slash_commands.delete(command.name);
			console.log("Unloaded " + "'" + command.name + "'" + ".");
		});
	}
	
	let commands = [];
	let total_size = 0;
	let file_size = 0;
	let count_skipped = 0;
	let count_error = 0;
	let count_commands = 0;
	let count_total = 0;
	let root_dir = await fs.readdirSync(process.cwd() + "/" + client.config.slash_commands_dir).filter(dir => !dir.includes("."));
	for (let dir of root_dir) {
		let file_size_dir = 0;
		let count_load = 0;
		let dir_path = process.cwd() + "/" + client.config.slash_commands_dir + "/" + dir;
		let files_dir = await fs.readdirSync(dir_path).filter(file => file.endsWith(".js"));
		
		if (dir.startsWith("_") || dir.includes(".")) { continue; }
		
		console.log("");
		console.log("Reading " + "'" + dir + "'" + " directory:");
		if (!files_dir.length) {
			console.log(chalk.greenBright("NOTICE:") + " This directory is empty, no slash commands loaded.");
			continue;
		}
		
		for (let file of files_dir) {
			try {
				let path_file = process.cwd() + "/" + client.config.slash_commands_dir + "/" + dir + "/" + file;
				file_size = fs.statSync(path_file).size;
				let command = require(path_file);
				if (isEmpty(command)) { continue; }
				else if (command.flags & constants.cmdFlags.dontLoad) {
					count_skipped++;
					console.log("Skipped " + "'" + command.name + "'" + ".");
				}
				else {
					if ((command.format) && (!isEmpty(command.format))) {
						let command_size = (file_size / 1024).toFixed(2);
						await client.slash_commands.set(command.name, command);
						commands.push(command.format);

						count_load++;
						count_commands++;
						console.log("Loaded " + "'" + command.name + "'" + "." + " (" + chalk.greenBright(command_size) + " KB)");
					}
					else {
						count_error++;
						console.error(chalk.redBright("ERROR:") + " Couldn't load " + "'" + file.replace(".js", "") + "'" + " because doesn't have a format!");
					}
				}
			} catch (error) {
				count_error++;
				console.error(chalk.redBright("ERROR:") + " Couldn't load " + "'" + file.replace(".js", "") + "'" + ":" + "\n", error);
			}
			count_total++;
			file_size_dir += file_size;
			total_size += file_size;
		}
		let directory_size = (file_size_dir / 1024).toFixed(2);
		console.log("Loaded " + chalk.greenBright(count_load) + " slash commands." + " (" + chalk.greenBright(directory_size) + " KB).");
	}
	let final_size = (total_size / 1024).toFixed(2);
	console.log("");
	console.log("Loaded all " + chalk.greenBright(count_commands) + " slash commands" + " (" + chalk.greenBright(final_size) + " KB in total)." + " " + "(" + chalk.redBright(count_error) + " errored)" + " " + "(" + chalk.yellowBright(count_skipped) + " skipped)");

	console.log("Registering slash commands for guilds...");
	let client_guilds = await client.guilds.fetch();
	let guilds_array = client_guilds.array();
	for (let guild_index = 0; guild_index < guilds_array.length; guild_index++) {
		let guild_element = await guilds_array[guild_index].fetch();
		await guild_element.commands.set(commands).then(async (command) => {
			console.log("Registered slash commands for " + guild_element.name + ".");
		}).catch(async (error) => {
			console.log("");
			console.error("Not added in " + guild_element.name + ":" + "\n" + error.message);
		});
	}
}
module.exports = slash_command_loader;
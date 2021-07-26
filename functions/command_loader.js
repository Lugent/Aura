const constants = require(process.cwd() + "/configurations/constants.js");
const fs = require("fs");
const chalk = require("chalk");

function isEmpty(obj) {
    if (obj == null) { return true; }
    if (obj.length > 0) { return false; }
    if (obj.length === 0) { return true; }
    if (typeof obj !== "object") { return true; }
    for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) return false; }
    return true;
}

async function command_loader(client, reload = false) {
	if (reload) {
		console.log("");
		console.log("Unloading commands:");
		await client.commands.forEach(async function(command) {
			let path = process.cwd() + "/" + client.config.commands_dir + "/" + command.path + "/" + command.name + ".js";
			delete require.cache[require.resolve(path)];
			await client.commands.delete(command.name);
			console.log("Unloaded " + "'" + command.name + "'" + ".");
		});
	}
	
	let total_size = 0;
	let file_size = 0;
	let count_skipped = 0;
	let count_error = 0;
	let count_commands = 0;
	let root_dir = await fs.readdirSync(process.cwd() + "/" + client.config.commands_dir).filter(dir => !dir.includes("."));
	for (let dir of root_dir) {
		let file_size_dir = 0;
		let count_load = 0;
		let dir_path = process.cwd() + "/" + client.config.commands_dir + "/" + dir;
		let files_dir = await fs.readdirSync(dir_path).filter(file => file.endsWith(".js"));
		
		if (dir.startsWith("_") || dir.includes(".")) { continue; }
		
		console.log("");
		console.log("Reading " + "'" + dir + "'" + " directory:");
		if (!files_dir.length) {
			console.log(chalk.greenBright("NOTICE:") + " This directory is empty, no commands loaded.");
			continue;
		}
		
		for (let file of files_dir) {
			try {
				let path_file = process.cwd() + "/" + client.config.commands_dir + "/" + dir + "/" + file;
				file_size = fs.statSync(path_file).size;
				let command = require(path_file);
				if (isEmpty(command)) { continue; }
				else if (!command.type || (command.flags & constants.cmdFlags.dontLoad)) {
					count_skipped++;
					console.log("Skipped " + "'" + command.name + "'" + ".");
				}
				else {
					await client.commands.set(command.name, command);
					
					let command_size = (file_size / 1024).toFixed(2);
					console.log("Loaded " + "'" + command.name + "'" + "." + " (" + chalk.greenBright(command_size) + " KB)");
					count_load++;
					count_commands++;
					file_size_dir += file_size;
					total_size += file_size;
				}
			} catch (error) {
				count_error++;
				console.error(chalk.redBright("ERROR:") + " Couldn't load " + "'" + file.replace(".js", "") + "'" + ":" + "\n", error);
			}
		}
		let directory_size = (file_size_dir / 1024).toFixed(2);
		console.log("Loaded " + chalk.greenBright(count_load) + " commands." + " (" + chalk.greenBright(directory_size) + " KB).");
	}
	let final_size = (total_size / 1024).toFixed(2);
	console.log("");
	console.log("Loaded all " + chalk.greenBright(count_commands) + " commands" + " (" + chalk.greenBright(final_size) + " KB in total)." + " " + "(" + chalk.redBright(count_error) + " errored)" + " " + "(" + chalk.yellowBright(count_skipped) + " skipped)");
}
module.exports = command_loader;
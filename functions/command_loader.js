const constants = require(process.cwd() + "/configurations/constants.js");
const fs = require("fs");

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
		console.log("Looking into " + "'" + dir + "'" + " directory:");
		if (!files_dir.length) {
			console.log("This directory is empty, no commands loaded.");
			continue;
		}
		
		for (let file of files_dir) {
			try {
				let path_file = process.cwd() + "/" + client.config.commands_dir + "/" + dir + "/" + file;
				let command = require(path_file);
				if (isEmpty(command)) { continue; }
				else if (!command.id || !command.type || (command.flags & constants.cmdFlags.dontLoad)) {
					count_skipped++;
					console.log("Skipped " + "'" + (command.id || command.name) + "'" + ".");
				}
				else {
					await client.commands.set(command.id, command);
					
					console.log("Loaded " + "'" + command.id + "'.");
					count_load++;
					count_commands++;
				}
			} catch (error) {
				console.error("Couldn't load " + "'" + file.replace(".js", "") + "'" + ":" + "\n", error);
				count_error++;
			}
		}
		console.log("Loaded " + count_load + " commands.");
	}
	console.log("");
	console.log("Loaded all " + count_commands + " commands." + " (" + count_error + " errored)" + " " + "(" + count_skipped + " skipped)");
}
module.exports = command_loader;
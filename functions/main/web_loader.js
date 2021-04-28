const fs = require("fs");
async function web_loader(client, app, reload = false) {
	console.log("Loading request handlers...");
	
	app.run = {}
	let web_root_dir = await fs.readdirSync(process.cwd() + "/" + client.config.web_dir);
	for (let file of web_root_dir) {
		try {
			let path_file = process.cwd() + "/" + client.config.web_dir + "/" + file;
			delete require.cache[require.resolve(path_file)];
			
			let size = await fs.statSync(path_file).size;
			let web = require(path_file);
			app.run[web.name] = web.execute
			console.log("Loaded handler " + "'" + file.replace(".js", "") + "'" + "." + " (" + ((size / 1024).toFixed(2)) + " KB)");
		}
		catch (error) {
			console.error("Couldn't load handler " + "'" + file.replace(".js", "") + "'" + ":" + "\n", error);
		}
	}
}
module.exports = web_loader;
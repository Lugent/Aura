// Web server
const express = require("express");
const app = express();
const server_port = 3000;
async function web_setup(client) {
	app.clean = function(text) {
		if (!text || (typeof text != "string")) { return text; }
		else {
			return text.replace(/&/g, "&#38;").replace(/</g, "&#60;").replace(/>/g, "&#62;").replace(/=/g, "&#61;").replace(/"/g, "&#34;").replace(/'/g, "&#39;")
		}
	}

	// Load handlers
	let web_loader = require(process.cwd() + "/functions/general/web_loader.js");
	await web_loader(client, app)

	// Allow assets
	app.use("/assets", express.static(process.cwd() + "/assets", {maxAge: "7d"}));
	app.use("/assets/web", express.static(process.cwd() + "/assets/web")); // override maxAge

	// Get request
	app.get("/server_leaderboard/:id", async (request, response) => { app.run.server_leaderboard(client, app, request, response); });

	app.listen(server_port, () => { console.log("Webserver connected at http://localhost:" + server_port); });
}
module.exports = web_setup;
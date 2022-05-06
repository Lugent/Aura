// Dependencies
const Discord = require("discord.js");

// Process handlers
process.on("unhandledRejection", (error) => { console.error("UNHANDLED ERROR:" + "\n", error); });

// Load variables
const dotenv = require("dotenv");
dotenv.config();

// Client
const client_setup = require(process.cwd() + "/functions/client_setup.js");
const client_events = require(process.cwd() + "/functions/client_events.js");
const intents = Object.values(Discord.Intents.FLAGS).reduce((acc, p) => acc | p, 0);
let client = new Discord.Client({
	intents: intents,
	allowedMentions: {repliedUser: false}, 
	presence: {status: "online"},
	//partials: ["MESSAGE", "CHANNEL", "REACTION", "USER", "GUILD_MEMBER"],
	//ws: { properties: { $browser: "Discord iOS" } }
});
client_setup(client);
client_events(client);
client.functions.resourceMonitor(client);
client.functions.autoSaveGame(client);
console.log("Client initialized.");

// Execute bot
const command_loader = require(process.cwd() + "/functions/command_loader.js");
async function run_bot() {
	console.log(">>> Getting commands");
	await command_loader(client);

	// Login
	let login_time = Date.now();
	client.login(process.env.DISCORD_TOKEN).then(async () => {
		console.log("Logged in " + (Date.now() - login_time) + "ms; As " + client.user.tag);
		client.connected = true;
	}).catch((error) => {
		console.log("Login failure.");
		console.log(error.message);
		process.exit();
	});
}
run_bot();
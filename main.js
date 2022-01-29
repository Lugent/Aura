// Dependencies
const Discord = require("discord.js");

// Process handlers
process.on("unhandledRejection", (error) => { console.error("Unhandled promise rejection." + "\n", error); });

// Load variables
const dotenv = require("dotenv");
dotenv.config();

// Client
const intents = Object.values(Discord.Intents.FLAGS).reduce((acc, p) => acc | p, 0);
let client = new Discord.Client({
	intents: intents,
	allowedMentions: {repliedUser: false}, 
	presence: {status: "online"},
	partials: ["MESSAGE", "CHANNEL", "REACTION", "USER", "GUILD_MEMBER"],
	//ws: { properties: { $browser: "Discord iOS" } }
});

// Execute bot
const client_setup = require(process.cwd() + "/functions/client_setup.js");
const client_events = require(process.cwd() + "/functions/client_events.js");
const command_loader = require(process.cwd() + "/functions/command_loader.js");
async function run_bot() {
	console.log("Loading client...");
	client_setup(client);
	client_events(client);
	
	console.log("Loading timers...");
	await client.functions.resourceMonitor(client);
	await client.functions.autoSaveGame(client);
	
	console.log("Loading commands...");
	await command_loader(client);

	// Login
	let login_time = Date.now();
	client.login(process.env.DISCORD_TOKEN).then(async () => {
		console.log("Connected to Discord in " + (Date.now() - login_time) + "ms");
		console.log("Client logged as " + client.user.tag);
		
		console.log("Executing post-login functions...");
		
		console.log("Registering application commands to all guilds...");
		await client.registerApplications(client);
		
		console.log("Everything is done and ready.")
		client.connected = true;
	}).catch((error) => {
		console.error("Failed on logging in to Discord." + "\n", error.message);
		process.exit();
	});
	console.log("Logging in to Discord...");
}
run_bot();
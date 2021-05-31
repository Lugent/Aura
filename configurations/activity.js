const config = require(process.cwd() + "/configurations/client.js");
const changelog = require(process.cwd() + "/configurations/changelog.js");
let status_data = [
	{
		activities: [{
			name: "now Open Source",
			type: "PLAYING"
		}],
		status: "online"
	},
	{
		activities: [{
			name: config.default.prefix + "help",
			type: "PLAYING"
		}],
		status: "online"
	},
	{
		activities: [{
			name: "Ra!",
			type: "PLAYING"
		}],
		status: "online"
	},
	{
		activities: [{
			name: "Rawr!",
			type: "PLAYING"
		}],
		status: "online"
	},
	{
		activities: [{
			name: config.default.prefix + " or @mention",
			type: "LISTENING"
		}],
		status: "online"
	},
	{
		activities: [{
			name: "changelog",
			type: "WATCHING"
		}],
		status: "dnd"
	},
	{
		activities: [{
			name: "the Aura Power",
			type: "WATCHING"
		}],
		status: "dnd"
	},
	{
		activities: [{
			name: "v" + changelog[0].version,
			type: "PLAYING"
		}],
		status: "online"
	},
	{
		activities: [{
			name: "with Lucario#6931",
			type: "PLAYING"
		}],
		status: "idle"
	},
	{
		activities: [{
			name: "for others Lucario",
			type: "WATCHING"
		}],
		status: "idle"
	},
	{
		activities: [{
			name: "with others Lucario",
			type: "PLAYING"
		}],
		status: "idle"
	},
	{
		activities: [{
			name: "a Gym",
			type: "COMPETING"
		}],
		status: "dnd"
	},
	{
		activities: [{
			name: "a Tournament",
			type: "COMPETING"
		}],
		status: "dnd"
	},
];
module.exports = status_data;
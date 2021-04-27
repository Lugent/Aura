const config = require(process.cwd() + "/configurations/client.js");
const changelog = require(process.cwd() + "/configurations/changelog.js");
let status_data = [
	{
		activity:
		{
			name: "now Open Source",
			type: "PLAYING"
		},
		status: "online"
	},
	{
		activity:
		{
			name: "=help",
			type: "PLAYING"
		},
		status: "online"
	},
	{
		activity:
		{
			name: "Ra!",
			type: "PLAYING"
		},
		status: "online"
	},
	{
		activity:
		{
			name: "Rawr!",
			type: "PLAYING"
		},
		status: "online"
	},
	{
		activity:
		{
			name: config.default.prefix + " or @mention",
			type: "LISTENING"
		},
		status: "online"
	},
	{
		activity:
		{
			name: "changelog",
			type: "WATCHING"
		},
		status: "dnd"
	},
	{
		activity:
		{
			name: "the Aura Power",
			type: "WATCHING"
		},
		status: "dnd"
	},
	{
		activity:
		{
			name: "v" + changelog[0].version,
			type: "PLAYING"
		},
		status: "online"
	},
	{
		activity:
		{
			name: "with Lucario#6931",
			type: "PLAYING"
		},
		status: "idle"
	},
	{
		activity:
		{
			name: "for others Lucario",
			type: "WATCHING"
		},
		status: "idle"
	},
	{
		activity:
		{
			name: "with others Lucario",
			type: "PLAYING"
		},
		status: "idle"
	},
	{
		activity:
		{
			name: "a Gym",
			type: "COMPETING"
		},
		status: "dnd"
	},
	{
		activity:
		{
			name: "a Tournament",
			type: "COMPETING"
		},
		status: "dnd"
	},
]
module.exports = status_data;
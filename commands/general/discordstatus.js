const Discord = require("discord.js");
const path = require("path");
const https = require("https");
const constants = require(process.cwd() + "/configurations/constants.js");
module.exports = {
    name: "discordstatus",
	path: path.basename(__dirname),
	type: constants.cmdTypes.normalCommand,

    cooldown: 5,
	description: "discordstatus.description",
	/**
	 * @param {Discord.Client} client
	 * @param {Discord.Message} message
	 * @param {Array} args
	 * @param {String} prefix
	 */
    async execute(client, message, args, prefix)
    {
		/* SERVICE */
		let serviceStatusTable = [
			{id: "none", name: "service_status.none", color: [0, 255, 0]},
			{id: "minor", name: "service_status.minor",  color: [255, 255, 0]},
			{id: "major", name: "service_status.major",  color: [255, 127, 0]},
			{id: "critical", name: "service_status.critical", color: [255, 0, 0]},
		];
		/* SERVICE */
		
		/* COMPONENTS */
		let idTable = [
			{id: "rhznvxg4v7yh", position: 0},
			{id: "r3wq1zsx72bz", position: 1},
			{id: "354mn7xfxz1h", position: 2},
			{id: "3y468xdr1st2", position: 3},
		];
		/* COMPONENTS */
		
		/* INDCIDENT */
		let incidentImpactTable = [
			{id: "none", name: "incident_impact.none"},
			{id: "minor", name: "incident_impact.minor"},
			{id: "major", name: "incident_impact.major"},
			{id: "critical", name: "incident_impact.critical"},
		];
		
		let incidentStatusTable = [
			{id: "investigating", name: "incident_status.investigating"},
			{id: "identified", name: "incident_status.identified"},
			{id: "monitoring", name: "incident_status.monitoring"},
			{id: "resolved", name: "incident_status.resolved"}
		];
		/* INDCIDENT */
		
		/* COMPONENT */
		let componentStatusTable = [
			{id: "operational", name: "component_status.operational"},
			{id: "degraded_performance", name: "component_status.degraded_performance"},
			{id: "partial_outage", name: "component_status.partial_outage"},
			{id: "major_outage", name: "component_status.major_outage"}
		];
		/* COMPONENT */
		
		var embed = new Discord.MessageEmbed();
		embed.setDescription(":hourglass: " + client.functions.getTranslation(client, message.author, message.guild, "commands/general/discordstatus", "loading"));
		embed.setColor([255, 255, 0]);
		
		let sent_message;
		await message.reply({embeds: [embed]}).then(message => { sent_message = message; });
		
		let rawData = "";
		https.get("https://srhpyqt94yxb.statuspage.io/api/v2/summary.json", async (res) => {
			res.on("data", async (chunk) => { rawData += chunk; });
			res.on("end", async () => {
				let finalComponents = [];
				let data = JSON.parse(rawData);
				let components = data.components;
				let serviceStatus = serviceStatusTable.find(status => data.status.indicator === status.id);
				let embed = new Discord.MessageEmbed();
				embed.setTitle(client.functions.getTranslation(client, message.author, message.guild, "commands/general/discordstatus", serviceStatus.name));
				for (let index = 0; index < components.length; index++) {
					let component = components[index];
					if (idTable.find(element => element.id === component.id)) {
						finalComponents.push(component);
					}
				}
				
				let componentsName = "";
				for (let index = 0; index < finalComponents.length; index++) {
					let component = finalComponents[index];
					let findData = componentStatusTable.find(status => component.status === status.id);
					componentsName += "**" + client.functions.getTranslation(client, message.author, message.guild, "commands/general/discordstatus", component.name) + "**: " + client.functions.getTranslation(client, message.author, message.guild, "commands/general/discordstatus", findData.name) + "\n";
				}
				
				let incidents = data.incidents;
				if (incidents) {
					let incidents_status = "";
					for (let index = 0; index < incidents.length; index++) {
						let incident = incidents[index];
						let find_data = incidentStatusTable.find(status => incident.status === status.id);
						let find_data2 = incidentImpactTable.find(status => incident.impact === status.id);
						componentsName += "\n" + "**" + client.functions.getTranslation(client, message.author, message.guild, "commands/general/discordstatus", "actual_incident") + ":**" + "\n" + incident.name + "\n" + client.functions.getTranslation(client, message.author, message.guild, "commands/general/discordstatus", find_data.name) + " - " + client.functions.getTranslation(client, message.author, message.guild, "commands/general/discordstatus", find_data2.name);
					}
				}
				
				embed.setDescription(componentsName);
				embed.setAuthor(client.functions.getTranslation(client, message.author, message.guild, "commands/general/discordstatus", "discord_status"), "https://cdn.discordapp.com/embed/avatars/0.png"); // "Estado de Discord"
				embed.setColor(serviceStatus.color);
				return sent_message ? sent_message.edit({embeds: [embed]}) : message.channel.send({embeds: [embed]});
			});
		}).on("error", (error) => {
			console.error(error);
			var embed = new Discord.MessageEmbed();
			embed.setColor([255, 0, 0]);
			embed.setDescription(":no_entry:" + client.functions.getTranslation(client, message.author, message.guild, "commands/general/discordstatus", "fatal_failure"));
			return sent_message ? sent_message.edit({embeds: [embed]}) : message.channel.send({embeds: [embed]});
		});
    }
}; 
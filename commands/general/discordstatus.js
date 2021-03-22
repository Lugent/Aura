const Discord = require("discord.js");
const constants = require(process.cwd() + "/configurations/constants.js");
const path = require("path");
const https = require("https");
module.exports = {
    name: "discordstatus",
	path: path.basename(__dirname),
    //aliases: ["profile"],
    cooldown: 5,
    //usage: "[usuario]",
	description: "command.discordstatus.desc",
    async execute(client, message, args)
    {
		/* SERVICE */
		let serviceStatusTable = [
			{id: "none", name: "command.discordstatus.servicestatus.none", color: [0, 255, 0]},
			{id: "minor", name: "command.discordstatus.servicestatus.minor",  color: [255, 255, 0]},
			{id: "major", name: "command.discordstatus.servicestatus.major",  color: [255, 127, 0]},
			{id: "critical", name: "command.discordstatus.servicestatus.critical", color: [255, 0, 0]},
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
			{id: "none", name: "Ninguno"},
			{id: "minor", name: "Menor"},
			{id: "major", name: "Mayor"},
			{id: "critical", name: "Critico"},
		];
		
		let incidentStatusTable = [
			{id: "investigating", name: "Investigando"},
			{id: "identified", name: "Identificado"},
			{id: "monitoring", name: "Monitoriando"},
			{id: "resolved", name: "Resuelto"}
		];
		/* INDCIDENT */
		
		/* COMPONENT */
		let componentStatusTable = [
			{id: "operational", name: "Funcionando"},
			{id: "degraded_performance", name: "Rendimiento degradado"},
			{id: "partial_outage", name: "Parcialmente caido"},
			{id: "major_outage", name: "Mayormente caido"}
		];
		/* COMPONENT */
		
		var embed = new Discord.MessageEmbed();
		embed.setDescription(":hourglass: " + client.utils.getTrans(client, message.author, message.guild, "command.discordstatus.loading.desc"));
		embed.setColor([255, 255, 0]);
		
		let sent_message = undefined;
		await message.channel.send(embed).then(message => { sent_message = message; });
		
		let rawData = "";
		https.get("https://srhpyqt94yxb.statuspage.io/api/v2/summary.json", async (res) => {
			res.on("data", async (chunk) => { rawData += chunk; });
			res.on("end", async () => {
				let finalComponents = [];
				let data = JSON.parse(rawData);
				let components = data.components;
				let serviceStatus = serviceStatusTable.find(status => data.status.indicator === status.id);
				let embed = new Discord.MessageEmbed();
				embed.setTitle(serviceStatus.name);
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
					componentsName += "**" + component.name + "**: " + findData.name + "\n"
				}
				
				let incidents = data.incidents;
				if (incidents) {
					let incidents_status = "";
					for (let index = 0; index < incidents.length; index++) {
						let incident = incidents[index];
						let find_data = incidentStatusTable.find(status => incident.status === status.id);
						let find_data2 = incidentImpactTable.find(status => incident.impact === status.id);
						componentsName += "\n" + "**" + "Incidente Actual" + ":**" + "\n" + incident.name + "\n" + find_data.name + " - " + find_data2.name;
					}
				}
				
				embed.setDescription(componentsName);
				embed.setAuthor("Estado de Discord", "https://cdn.discordapp.com/embed/avatars/0.png");
				embed.setColor(serviceStatus.color);
				return sent_message ? sent_message.edit(embed) : message.channel.send(embed);
			});
		}).on("error", (error) => {
			console.error(error);
			var embed = new Discord.MessageEmbed();
			embed.setColor([255, 0, 0]);
			embed.setDescription(":no_entry:" + client.utils.getTrans(client, message.author, message.guild, "command.discordstatus.failure.fatal"));
			return sent_message ? sent_message.edit(embed) : message.channel.send(embed);
		});
    }
};
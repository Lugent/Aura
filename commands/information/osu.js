const Discord = require("discord.js");
const path = require("path");
const https = require("https");
module.exports = {
	name: "osu",
	path: path.basename(__dirname),
    cooldown: 6,
	description: "osu.usage",

	/**
	 * @param {Discord.Client} client
	 * @param {Discord.Message} message
	 * @param {Array} args
	 * @param {String} prefix
	 */
	async execute(client, message, args, prefix) {
        let api_url = "https://osu.ppy.sh/api/";
        let api_key = process.env.OSU_KEY;

		let raw_data = "";
		https.get(api_url + "get_user?k=" + api_key + "&u=" + args[0], async (response) => {
			response.on("data", async (chunk) => { raw_data += chunk; });
			response.on("end", async () => {
				try {
					let json_data = JSON.parse(raw_data);
					message.reply({
						files: [
							new Discord.MessageAttachment(Buffer.from(raw_data), "json_data.json")
						]
					});
					console.log(json_data);
				}
				catch (error) {
					throw error;
				}
			});
		}).on("error", async (error) => {
			throw error;
		});
    }
};
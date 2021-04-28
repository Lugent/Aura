const Discord = require("discord.js");
const constants = require(process.cwd() + "/configurations/constants.js");
const path = require("path");
const ytdl = require("ytdl-core");
module.exports = {
    name: "music",
	path: path.basename(__dirname),
    cooldown: 5,
    usage: "music.usage",
	description: "music.description",
	
	/**
	 * @param {Discord.Client} client
	 * @param {Discord.Message} message
	 * @param {Array} args
	 * @param {String} prefix
	 */
    async execute(client, message, args, prefix)
    {
		if (message.channel.type !== "text") { return message.channel.send("Please use this command on a server."); }
		
		let evoker_channel = message.channel;
		let voice_channel = message.member.voice.channel;
		if (!args[0]) {
			return message.channel.send("Specify subcommand!" + "\n" + "`" + prefix + "music play <file/url>`"  + "\n" + "`" + prefix + "music stop`"  + "\n" + "`" + prefix + "music disconnect`");
		}
		
		switch (args[0]) {
			case "stop": {
				if (!voice_channel) { return message.channel.send("You're not in a voice channel!"); }
				
				let voice_connection;
				let client_connections = client.voice.connections.array();
				for (let connection_index = 0; connection_index < client_connections.length; connection_index += 1) {
					if (client_connections[connection_index].channel.id === voice_channel.id) {
						voice_connection = client_connections[connection_index];
						break;
					}
				}
				if (!voice_connection) { return message.channel.send("I'm not connected that the voice channel!"); }
				if (!voice_connection.dispatcher) { return message.channel.send("I'm not currectly playing!"); }
				
				voice_connection.dispatcher.pause();
				voice_connection.dispatcher.destroy();
				return message.channel.send("Stopped playback.");
			}
			case "disconnect": {
				if (!voice_channel) { return message.channel.send("You're not in a voice channel!"); }
				
				let client_connections = client.voice.connections.array();
				for (let connection_index = 0; connection_index < client_connections.length; connection_index += 1) {
					if (client_connections[connection_index].channel.id === voice_channel.id) {
						voice_channel.leave();
						return message.channel.send("Disconnected.");
					}
				}
				
				return message.channel.send("I'm not connected to that voice channel!");
			}
			case "play": {
				if (!voice_channel) { return message.channel.send("Join a voice channel!"); }
				
				let youtube_link;
				let url_link;
				if (args[1]) {
					youtube_link = args[1].startsWith("https://www.youtube.com/") ? args[1] : undefined;
					url_link = (args[1].startsWith("http://") || args[1].startsWith("https://")) ? args[1] : undefined;
				}
				
				let audio_file = message.attachments.first() || undefined;
				let selected_music = youtube_link || url_link || audio_file;
				if (!selected_music) { return message.channel.send("Specify an URL or an file!"); }
				voice_channel.join().then(async (connection) => {
					connection.on("error", (error) => { evoker_channel.send(error.message); });
					
					let target_audio;
					if (youtube_link) { target_audio = ytdl(youtube_link, {filter: "audioonly", quality: "highestaudio"}); }
					else if (url_link) { target_audio = url_link; }
					else if (audio_file) { target_audio = audio_file.url; }
					
					let dispatcher = connection.play(target_audio, {highWaterMark: 10});
					dispatcher.on("start", () => { evoker_channel.send("Playing..."); });
					dispatcher.on("error", () => {
						evoker_channel.send("An error occurred during playback.");
					});
				});
				break;
			}
			default: {
				message.channel.send("Invalid subcommand!");
				break;
			}
		}
    }
};
const Discord = require("discord.js");
const constants = require(process.cwd() + "/configurations/constants.js");
const path = require("path");
const ytdl = require("ytdl-core");
module.exports = {
    name: "music",
	path: path.basename(__dirname),
    cooldown: 5,
    usage: "command.music.usage",
	description: "command.music.desc",
    async execute(client, message, args, prefix)
    {
		if (message.channel.type !== "text") { return message.channel.send("GO TO A TEXT CHANNEL YOU MORRON!!!"); }
		
		let evoker_channel = message.channel;
		let voice_channel = message.member.voice.channel;
		if (!args[0]) {
			return message.channel.send("Specify subcommand!" + "\n" + "`" + prefix + "music play <file/url>`"  + "\n" + "`" + prefix + "music stop`"  + "\n" + "`" + prefix + "music disconnect`");
		}
		
		switch (args[0]) {
			case "stop": {
				if (!voice_channel) { return message.channel.send("You're not in a voice channel!"); }
				
				let voice_connection = undefined;
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
				break;
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
				break;
			}
			case "play": {
				if (!voice_channel) { return message.channel.send("Join a voice channel!"); }
				
				let youtube_link = undefined;
				let url_link = undefined;
				if (args[1]) {
					youtube_link = args[1].startsWith("https://www.youtube.com/") ? args[1] : undefined;
					url_link = (args[1].startsWith("http://") || args[1].startsWith("https://")) ? args[1] : undefined;
				}
				
				let audio_file = message.attachments.first() || undefined;
				let selected_music = youtube_link || url_link || audio_file;
				if (!selected_music) { return message.channel.send("Specify an URL or an file!"); }
				voice_channel.join().then(async (connection) => {
					//connection.on("disconnect", () => { evoker_channel.send("Disconnected."); });
					//connection.on("ready", () => { evoker_channel.send("Resumed connection."); });
					connection.on("error", (error) => { evoker_channel.send(error.message); });
					
					let target_audio = undefined;
					if (youtube_link) { target_audio = ytdl(youtube_link, {filter: "audioonly", quality: "highestaudio"}); }
					else if (url_link) { target_audio = url_link; }
					else if (audio_file) { target_audio = audio_file.url; }
					
					let dispatcher = connection.play(target_audio, {highWaterMark: 1}); //connection.play("D:/Archivos/Variado/Audios/LSPE/bgmSpecialStage.wav");
					dispatcher.on("start", () => { evoker_channel.send("Playing..."); });
					dispatcher.on("error", () => {
						evoker_channel.send("An error occurred during playback. Disconnecting...");
						connection.disconnect();
					});
					/*dispatcher.on("finish", () => {
						evoker_channel.send("Playback ended. Disconnecting...");
						connection.disconnect();
					});*/
				});
				break;
			}
			default: {
				message.channel.send("Invalid subcommand!" + "\n" + "`" + prefix + "music play <file/url>`");
				break;
			}
		}
    }
};
const Discord = require("discord.js");
const util = require("util");
const changelog = require(process.cwd() + "/configurations/changelog.js");

function getRandomInt(max) { return Math.floor(Math.random() * Math.floor(max)); }
function getRandomRangeInt(min, max) { return Math.floor(Math.random() * ((max - min) + 1)) + min; }

function generateDateString(client, author, guild, get_date) {
	if (typeof get_date !== "object") { return; }
	
	let date_week_day_number = get_date.getDay();
	let date_week_day_string = client.utils.getTrans(client, author, guild, "utils.date.day.sunday"); // Domingo
	switch (date_week_day_number) {
		case 1: { date_week_day_string = client.utils.getTrans(client, author, guild, "utils.date.day.monday"); break; } // Lunes
		case 2: { date_week_day_string = client.utils.getTrans(client, author, guild, "utils.date.day.tuesday"); break; } // Martes
		case 3: { date_week_day_string = client.utils.getTrans(client, author, guild, "utils.date.day.wednesday"); break; } // Miercoles
		case 4: { date_week_day_string = client.utils.getTrans(client, author, guild, "utils.date.day.thursday"); break; } // Juevez
		case 5: { date_week_day_string = client.utils.getTrans(client, author, guild, "utils.date.day.friday"); break; } // Viernes
		case 6: { date_week_day_string = client.utils.getTrans(client, author, guild, "utils.date.day.saturday"); break; } // Sabado
	}
	
	let date_month_day_number = get_date.getDate();
	let date_month_day_english = numberOrdinal(date_month_day_number);
	let date_month_number = get_date.getMonth();
	let date_month_string = client.utils.getTrans(client, author, guild, "utils.date.month.january"); // enero
	switch (date_month_number) {
		case 1: { date_month_string = client.utils.getTrans(client, author, guild, "utils.date.month.february"); break; } // febrero
		case 2: { date_month_string = client.utils.getTrans(client, author, guild, "utils.date.month.march"); break; } // marzo
		case 3: { date_month_string = client.utils.getTrans(client, author, guild, "utils.date.month.april"); break; } // abril
		case 4: { date_month_string = client.utils.getTrans(client, author, guild, "utils.date.month.may"); break; } // mayo
		case 5: { date_month_string = client.utils.getTrans(client, author, guild, "utils.date.month.june"); break; } // junio
		case 6: { date_month_string = client.utils.getTrans(client, author, guild, "utils.date.month.july"); break; } // julio
		case 7: { date_month_string = client.utils.getTrans(client, author, guild, "utils.date.month.august"); break; } // agosto
		case 8: { date_month_string = client.utils.getTrans(client, author, guild, "utils.date.month.september"); break; } // septiembre
		case 9: { date_month_string = client.utils.getTrans(client, author, guild, "utils.date.month.october"); break; } // octubre
		case 10: { date_month_string = client.utils.getTrans(client, author, guild, "utils.date.month.november"); break; } // noviembre
		case 11: { date_month_string = client.utils.getTrans(client, author, guild, "utils.date.month.december"); break; } // diciembre
	}
	
	let date_year_number = get_date.getFullYear();
	return client.utils.getTrans(client, author, guild, "utils.date.complete_date", [date_week_day_string, date_month_day_number, date_month_day_english, date_month_string, date_year_number]);
}

function generateTimeString(client, author, guild, get_date) {
	if (typeof get_date !== "object") {
		if (typeof get_date === "number") {
			get_date = new Date(get_date); 
		}
		else { return; }
	}
	
	
	let is_12hours = true;
	let get_language = "es";
	let server_data = client.server_data.prepare("SELECT * FROM settings WHERE guild_id = ?;").get(guild.id);
	let server_language = server_data.language;
	switch (server_language) {
		case "en": { is_12hours = false; break; }
	}
	
	let date_hour = is_12hours ? ((get_date.getHours() % 12) ? (get_date.getHours() % 12) : 12) : get_date.getHours();
	let date_minute = ((get_date.getMinutes() + 1) < 10) ? ("0" + (get_date.getMinutes() + 1)) : (get_date.getMinutes() + 1);
	let date_second = ((get_date.getSeconds() + 1) < 10) ? ("0" + (get_date.getSeconds() + 1)) : (get_date.getSeconds() + 1);
	let date_suffix = (is_12hours ? ((get_date.getHours() > 12) ? " PM" : " AM") : "");
	return client.utils.getTrans(client, author, guild, "utils.date.complete_time", [date_hour, date_minute, date_second, date_suffix]);
}

function generateDurationString(client, author, guild, get_time, is_full = false) {
	if (typeof get_time !== "number") { return; }
	
	let seconds_string = client.utils.getTrans(client, author, guild, "utils.duration.seconds");
	let minutes_string = client.utils.getTrans(client, author, guild, "utils.duration.minutes");
	let hours_string = client.utils.getTrans(client, author, guild, "utils.duration.hours");
	let days_string = client.utils.getTrans(client, author, guild, "utils.duration.days");
	
	let calculated_time = Math.abs(new Date().getTime() - get_time);
	let get_seconds = (calculated_time / 1000);
	let get_minutes = (get_seconds / 60);
	let get_hours = (get_minutes / 60);
	let get_days = (get_hours / 24);
	
	var get_time = ((get_days.toFixed(0) > 0) ? (get_days.toFixed(0) + " " + days_string + ", ") : "") + (((get_hours.toFixed(0) % 24) > 0) ? ((get_hours.toFixed(0) % 24) + " " + hours_string + ", ") : "") + (((get_minutes.toFixed(0) % 60) > 0) ? ((get_minutes.toFixed(0) % 60) + " " + minutes_string + ", ") : "") + (get_seconds.toFixed(0) % 60) + " " + seconds_string;
	if (is_full) {
		get_time = get_days.toFixed(0) + " " + days_string + ", " + (get_hours.toFixed(0) % 24) + " " + hours_string + ", " +  (get_minutes.toFixed(0) % 60) + " " + minutes_string + ", " +  (get_seconds.toFixed(0) % 60) + " " + seconds_string;
	}
	return get_time;
}

function ISODateToJSDate(isodate_string) {
    var parts = isodate_string.match(/\d+/g);
    return new Date(parts[0], parts[1] - 1, parts[2], parts[3], parts[4], parts[5]);
}

function numberOrdinal(number) {
	if (number <= 0) { return number; } // Zero or negatives doesn't supported
	if (((number % 100) >= 11) && ((number % 100) <= 13)) { return number + "th"; } // More or equals that 11 and less or equals that 13
	switch (number % 10) // Return depending number
	{
		case 1: { return number + "st"; } // One
		case 2: { return number + "nd"; } // Two
		case 3: { return number + "rd"; } // Three
		default: { return number + "th"; } // Four or more
	}
}

function number_formatter(num, digits) {
	var formats = [
		{value: 1, symbol: ""}, // None
		{value: 1E3, symbol: "k"}, // Thousand
		{value: 1E6, symbol: "M"}, // Million
		{value: 1E9, symbol: "B"}, // Billion
		{value: 1E12, symbol: "T"}, // Trillion
		{value: 1E15, symbol: "QD"}, // Quadrillion
		{value: 1E18, symbol: "QT"}, // Quintillion
		{value: 1E21, symbol: "SX"}, // Sextillion
		{value: 1E24, symbol: "SP"}, // Septillion
		{value: 1E27, symbol: "OC"}, // Octillion
		{value: 1E30, symbol: "NO"}, // Nonillion
		{value: 1E33, symbol: "DE"}, // Decillion
		{value: 1E36, symbol: "UN"}, // Undecillion
		{value: 1E39, symbol: "DU"}, // Duodecillion
		{value: 1E42, symbol: "TR"}, // Tredecillion
		{value: 1E45, symbol: "QU"}, // Quattuordecillion
		{value: 1E48, symbol: "QN"}, // Quindecillion
		{value: 1E51, symbol: "SD"}, // Sexdecillion
		{value: 1E54, symbol: "SP"}, // Septendecillion
		{value: 1E57, symbol: "OD"}, // Octodecillion	
		{value: 1E60, symbol: "ND"}, // Novemdecillion
		{value: 1E63, symbol: "VT"}, // Vigintillion
		{value: 1E66, symbol: "CT"} // Centillion
	];
	
	let result = num;
	let rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
	for (let i = formats.length - 1; i > 0; i--) {
		if (num >= formats[i].value) {
			result = (num / formats[i].value).toFixed(digits).replace(rx, "$1") + formats[i].symbol;
			break;
		}
	}
	return result;
}

function resources_monitoring(client) {
	// CPU usage
	let previousTime = new Date().getTime();
	let previousUsage = process.cpuUsage();
	let lastUsage;
	setInterval(() => {
		let currentUsage = process.cpuUsage(previousUsage);
		previousUsage = process.cpuUsage();
		
		let currentTime = new Date().getTime();
		let timeDelta = (currentTime - previousTime) * 10;
		let { user, system } = currentUsage;
		lastUsage = { system: system / timeDelta, total: (system + user) / timeDelta, user: user / timeDelta };
		previousTime = currentTime;
		client.statsCPU = lastUsage;
		if (lastUsage.total > 170) { process.abort(); }
	}, 1000);

	// RAM usage
	setInterval(() => { if ((process.memoryUsage().rss / 1000000) > 512) { process.abort(); } }, 1000);
}

function create_server_data(client, guild) {
	if (!guild) { return; }
	
	let get_server_settings = client.server_data.prepare("SELECT * FROM settings WHERE guild_id = ?;").get(guild.id);
	if (!get_server_settings) {
		try {
			client.server_data.prepare("INSERT INTO settings (guild_id, prefix, language) VALUES (?, ?, ?);").run(guild.id, client.config.default.prefix, client.config.default.language);
		}
		catch (error) {
			console.error("ERROR: " + "Cannot create settings for guild: " + guild.name + "\n", error);
		}
		finally {
			console.log("Created settings for guild: " + guild.name);
		}
	}
	
	let get_server_features = client.server_data.prepare("SELECT * FROM features WHERE guild_id = ?;").get(guild.id);
	if (!get_server_features) {
		try {
			client.server_data.prepare("INSERT INTO features (guild_id, disabled_functions, disabled_commands) VALUES (?, ?, ?);").run(guild.id, "", "");
		}
		catch (error) {
			console.error("ERROR: " + "Cannot create features for guild: " + guild.name + "\n", error);
		}
		finally {
			console.log("Created features for guild: " + guild.name);
		}
	}
}

function create_user_data(client, user) {
	if (!user) { return; }
	if (user.bot) { return; }
	
	let get_user_settings = client.user_data.prepare("SELECT * FROM settings WHERE user_id = ?;").get(user.id);
	if (!get_user_settings) {
		try {
			client.user_data.prepare("INSERT INTO settings (user_id, language) VALUES (?, ?)").run(user.id, client.config.default.language);
		}
		catch (error) {
			console.error("ERROR: " + "Cannot create settings for user: " + user.tag + "\n", error);
		}
		finally {
			console.log("Created settings for user: " + user.tag);
		}
	}
}

// Status updater
function status_update(client) {
	let status_data = [
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
				name: client.config.default.prefix + " or @mention",
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
    client.user.setPresence(status_data[getRandomInt(status_data.length)]);
}

async function generateRankIcon(client, Canvas, level_number) {
	let level_table = client.config.exp_shield_table;
	let rank_front_image = undefined;
	let rank_back_image = undefined;
	let get_backlayer = level_table.find(level_table_index => level_number >= level_table_index.level)
	if (get_backlayer) {
		rank_back_image = await Canvas.loadImage(process.cwd() + "/assets/images/ranking/backlayer/rank_back_icon_" + get_backlayer.type + ".png");
	}
	
	if (level_number > -1) {
		rank_front_image = await Canvas.loadImage(process.cwd() + "/assets/images/ranking/frontlayer/rank_front_icon_" + (level_number % 60) + ".png");
	}
	
	if (level_number >= client.config.exp_level_max) {
		rank_front_image = await Canvas.loadImage(process.cwd() + "/assets/images/ranking/frontlayer/rank_front_icon_60.png");
	}
	return {rank_front_image: rank_front_image, rank_back_image: rank_back_image};
}

module.exports = {
	create_server_data: create_server_data,
	create_user_data: create_user_data,
	getRandomInt: getRandomInt,
	number_formatter: number_formatter,
	resources_monitoring: resources_monitoring,
	status_update: status_update,
	generateRankIcon: generateRankIcon,
	numberOrdinal: numberOrdinal,
	ISODateToJSDate: ISODateToJSDate,
	generateDateString: generateDateString,
	generateTimeString: generateTimeString,
	generateDurationString: generateDurationString
};
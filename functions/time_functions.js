function generateDateString(client, author, guild, get_date) {
	if (typeof get_date !== "object") { return; }
	
	let date_week_day_number = get_date.getDay();
	let date_week_day_string = client.functions.getTranslation(client, author, guild, "functions", "date.day.sunday"); // Domingo
	switch (date_week_day_number) {
		case 1: { date_week_day_string = client.functions.getTranslation(client, author, guild, "functions", "date.day.monday"); break; } // Lunes
		case 2: { date_week_day_string = client.functions.getTranslation(client, author, guild, "functions", "date.day.tuesday"); break; } // Martes
		case 3: { date_week_day_string = client.functions.getTranslation(client, author, guild, "functions", "date.day.wednesday"); break; } // Miercoles
		case 4: { date_week_day_string = client.functions.getTranslation(client, author, guild, "functions", "date.day.thursday"); break; } // Juevez
		case 5: { date_week_day_string = client.functions.getTranslation(client, author, guild, "functions", "date.day.friday"); break; } // Viernes
		case 6: { date_week_day_string = client.functions.getTranslation(client, author, guild, "functions", "date.day.saturday"); break; } // Sabado
	}
	
	let date_month_day_number = get_date.getDate();
	let date_month_day_english = client.functions.getOrdinalNumber(date_month_day_number);
	let date_month_number = get_date.getMonth();
	let date_month_string = client.functions.getTranslation(client, author, guild, "functions", "date.month.january"); // enero
	switch (date_month_number) {
		case 1: { date_month_string = client.functions.getTranslation(client, author, guild, "functions", "date.month.february"); break; } // febrero
		case 2: { date_month_string = client.functions.getTranslation(client, author, guild, "functions", "date.month.march"); break; } // marzo
		case 3: { date_month_string = client.functions.getTranslation(client, author, guild, "functions", "date.month.april"); break; } // abril
		case 4: { date_month_string = client.functions.getTranslation(client, author, guild, "functions", "date.month.may"); break; } // mayo
		case 5: { date_month_string = client.functions.getTranslation(client, author, guild, "functions", "date.month.june"); break; } // junio
		case 6: { date_month_string = client.functions.getTranslation(client, author, guild, "functions", "date.month.july"); break; } // julio
		case 7: { date_month_string = client.functions.getTranslation(client, author, guild, "functions", "date.month.august"); break; } // agosto
		case 8: { date_month_string = client.functions.getTranslation(client, author, guild, "functions", "date.month.september"); break; } // septiembre
		case 9: { date_month_string = client.functions.getTranslation(client, author, guild, "functions", "date.month.october"); break; } // octubre
		case 10: { date_month_string = client.functions.getTranslation(client, author, guild, "functions", "date.month.november"); break; } // noviembre
		case 11: { date_month_string = client.functions.getTranslation(client, author, guild, "functions", "date.month.december"); break; } // diciembre
	}
	
	let date_year_number = get_date.getFullYear();
	return client.functions.getTranslation(client, author, guild, "functions", "date.complete", [date_week_day_string, date_month_day_number, date_month_day_english, date_month_string, date_year_number]);
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
	return client.functions.getTranslation(client, author, guild, "functions", "time.complete", [date_hour, date_minute, date_second, date_suffix]);
}

function generateDurationString(client, author, guild, get_time, is_full = false) {
	if (typeof get_time !== "number") { return; }
	
	let seconds_string = client.functions.getTranslation(client, author, guild, "functions", "duration.seconds");
	let minutes_string = client.functions.getTranslation(client, author, guild, "functions", "duration.minutes");
	let hours_string = client.functions.getTranslation(client, author, guild, "functions", "duration.hours");
	let days_string = client.functions.getTranslation(client, author, guild, "functions", "duration.days");
	
	let calculated_time = Math.abs(new Date().getTime() - get_time);
	let get_seconds = (calculated_time / 1000);
	let get_minutes = (get_seconds / 60);
	let get_hours = (get_minutes / 60);
	let get_days = (get_hours / 24);
	
	var full_time = ((get_days.toFixed(0) > 0) ? (get_days.toFixed(0) + " " + days_string + ", ") : "") + (((get_hours.toFixed(0) % 24) > 0) ? ((get_hours.toFixed(0) % 24) + " " + hours_string + ", ") : "") + (((get_minutes.toFixed(0) % 60) > 0) ? ((get_minutes.toFixed(0) % 60) + " " + minutes_string + ", ") : "") + (get_seconds.toFixed(0) % 60) + " " + seconds_string;
	if (is_full) {
		full_time = get_days.toFixed(0) + " " + days_string + ", " + (get_hours.toFixed(0) % 24) + " " + hours_string + ", " +  (get_minutes.toFixed(0) % 60) + " " + minutes_string + ", " +  (get_seconds.toFixed(0) % 60) + " " + seconds_string;
	}
	return full_time;
}

function ISODateToJSDate(isodate_string) {
    var parts = isodate_string.match(/\d+/g);
    return new Date(parts[0], parts[1] - 1, parts[2], parts[3], parts[4], parts[5]);
}

module.exports = {
    ISODateToJSDate: ISODateToJSDate,
	generateDateString: generateDateString,
	generateTimeString: generateTimeString,
	generateDurationString: generateDurationString
};
const changelog = [
	{
		version: "1.4.0.0",
		data: [
			":blue_circle: Re-escritura de la mayoria del código.",
		]
	},
	{
		version: "1.3.5.0",
		data: [
			":white_check_mark: Sistema de niveles.",
			":white_check_mark: `rank` y `leaderboard` (incompleto) añadidos.",
			":white_check_mark: `gsettings` completamente terminado.",
			":blue_circle: Re-estructuración de la base de datos.",
			":x: `language` y `prefix` eliminados a favor de `gsettings`.",
			":x: `nuke` eliminado.",
		]
	},
	{
		version: "1.3.4.0",
		data: [
			":white_check_mark: `purge` añadido.",
			":white_check_mark: `gsettings` añadido como combinación de `language` y `prefix` (Experimental).",
			":blue_circle: `guild` cambiado completamente.",
		]
	},
	{
		version: "1.3.3.1",
		data: [
			":white_check_mark: :flag_eu: Europa" + " visible en `guild` como región de voz.",
		]
	},
	{
		version: "1.3.3.0",
		data: [
			":white_check_mark: Algunos cambios en los embed.",
			":white_check_mark: Textos faltantes en el idioma español y ingles de `youtube` y `image`.",
			":white_check_mark: :flag_sg: Singapur" + " visible en `guild` como región de voz.",
			":blue_circle: Diseño cambiado de `guild`.",
		]
	},
	{
		version: "1.3.2.0",
		data: [
			":white_check_mark: `image` añadido. (Experimental).",
			":white_check_mark: `youtube` añadido. (Incompleto, solo busca videos).",
			":white_check_mark: `status` añadido, para monitorear el estado actual de discord.",
			":white_check_mark: `uptime` añadido.",
			":white_check_mark: Categorias en `help`.",
			":blue_circle: `afk` usa base de dato en vez de collector. (Sin perdidas de AFK).",
			":blue_circle: Cambio visual de embed parcial.",
			":x: Argumento opcional de `guild` eliminado.",
			":x: `guilds` eliminado.",
		]
	},
	{
		version: "1.3.1.0",
		data: [
			":white_check_mark: Idioma ingles agregado.",,
			":white_check_mark: Advertencia de idiomas no completados mediante `language`.",
		]
	},
	{
		version: "1.3.0.0",
		data: [
			":white_check_mark: Sistema multilenguaje. (Solo español disponible).",
			":white_check_mark: `nuke` re-añadido.",
		]
	},
	{
		version: "1.2.5.0",
		data: [
			":white_check_mark: `member` añadido.",
			":white_check_mark: Nuevo sistema de actualizar comandos.",
			":blue_circle: Actualizado descripción de uso de `guild`.",
			":blue_circle: `guilds` visible debido al argumento opcional de `guild`.",
			":x: `nuke` eliminado temporalmente.",
		]
	},
	{
		version: "1.2.4.2",
		data: [
			":white_check_mark: `changelog` añadido.",
			":white_check_mark: `weather` añadido.",
		]
	}
]
module.exports = changelog;
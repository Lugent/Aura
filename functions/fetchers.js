/* GENERAL */
async function fetchApplication(client) {
	let get_application;
	await client.fetchApplication().then(async (got_application) => {
		get_application = got_application;
		get_application = got_application;
	}).catch((error) => {
		//console.log(error);
	});
	return get_application;
}

async function fetchApplicationAssets(client, application) {
	let get_application_assets;
	await application.fetchAssets().then(async (got_application_assets) => {
		get_application_assets = got_application_assets;
	}).catch((error) => {
		//console.log(error);
	});
	return get_application_assets;
}

async function fetchChannel(client, id) {
	let get_channel;
	await client.channels.fetch(id, true, true).then(async (got_channel) => {
		get_channel = got_channel;
	}).catch((error) => {
		//console.log(error);
	});
	return get_channel;
}

async function fetchChannelMessages(client, channel, messages = {}) {
	let get_channel_messages;
	if (channel.isText()) {
		await channel.messages.fetch(messages, true, true).then(async (got_channel_messages) => {
			get_channel_messages = got_channel_messages;
		}).catch((error) => {
			//console.log(error);
		});
	}
	return get_channel_messages;
}

async function fetchGuild(client, id) {
	let get_guild;
	await client.guilds.fetch(id, true, true).then(async (got_guild) => {
		get_guild = got_guild;
	}).catch((error) => {
		//console.log(error);
	});
	return get_guild;
}

async function fetchGuildPreview(client, guild) {
	let get_guild_preview;
	await client.fetchGuildPreview(guild).then(async (got_guild_preview) => {
		get_guild_preview = got_guild_preview;
	}).catch((error) => {
		//console.log(error);
	});
	return get_guild_preview;
}

async function fetchGuildTemplate(client, template) {
	let get_guild_template;
	await client.fetchGuildTemplate(template).then(async (got_guild_template) => {
		get_guild_template = got_guild_template;
	}).catch((error) => {
		//console.log(error);
	});
	return get_guild_template;
}

async function fetchMessage(client, message) {
	let get_message;
	await message.fetch(true).then(async (got_message) => {
		get_message = got_message;
	}).catch((error) => {
		//console.log(error);
	});
	return get_message;
}

async function fetchMessageReaction(client, reaction) {
	let get_message_reaction;
	await reaction.fetch().then(async (got_message_reaction) => {
		get_message_reaction = got_message_reaction;
	}).catch((error) => {
		//console.log(error);
	});
	return get_message_reaction;
}

async function fetchMessageUserReactions(client, users_reactions) {
	let get_message_user_reactions;
	await users_reactions.fetch().then(async (got_message_user_reactions) => {
		get_message_user_reactions = got_message_user_reactions;
	}).catch((error) => {
		//console.log(error);
	});
	return get_message_user_reactions;
}

async function fetchInvite(client, invite) {
	let get_invite;
	await client.fetchInvite(invite).then(async (got_invite) => {
		get_invite = got_invite;
	}).catch((error) => {
		//console.log(error);
	});
	return get_invite;
}

async function fetchUser(client, id) {
	let get_user;
	await client.users.fetch(id, true, true).then(async (got_user) => {
		get_user = got_user;
	}).catch((error) => {
		//console.log(error);
	});
	return get_user;
}

async function fetchUserFlags(client, user) {
	let get_user_flags;
	await user.fetch(true).then(async (got_user_flags) => {
		get_user_flags = got_user_flags;
	}).catch((error) => {
		//console.log(error);
	});
	return get_user_flags;
}

async function fetchVoiceRegions(client) {
	let get_voice_regions;
	await client.fetchVoiceRegions(invite).then(async (got_voice_regions) => {
		get_voice_regions = got_voice_regions;
	}).catch((error) => {
		//console.log(error);
	});
	return get_voice_regions;
}

async function fetchWebhook(client, id, token) {
	let get_webhook;
	await client.fetchWebhook(id, token).then(async (got_webhook) => {
		get_webhook = got_webhook;
	}).catch((error) => {
		//console.log(error);
	});
	return get_webhook;
}
/* GENERAL */

/* GUILD */
async function fetchGuildBan(client, guild, user) {
	let get_guild_ban;
	await guild.fetchBan(user).then(async (got_guild_ban) => {
		get_guild_ban = got_guild_ban;
	}).catch((error) => {
		//console.log(error);
	});
	return get_guild_ban;
}

async function fetchGuildBans(client, guild) {
	let get_guild_bans;
	await guild.fetchBans().then(async (got_guild_bans) => {
		get_guild_bans = got_guild_bans;
	}).catch((error) => {
		//console.log(error);
	});
	return get_guild_bans;
}

async function fetchGuildIntegrations(client, guild) {
	let get_guild_integrations;
	await guild.fetchIntegrations({includeApplications: true}).then(async (got_guild_integrations) => {
		get_guild_integrations = got_guild_integrations;
	}).catch((error) => {
		//console.log(error);
	});
	return get_guild_integrations;
}

async function fetchGuildIntegrationAssets(client, integration) {
	let get_guild_integration_assets;
	await integration.fetchAssets().then(async (get_guild_integration_assets) => {
		get_guild_integration_assets = got_guild_integration_assets;
	}).catch((error) => {
		//console.log(error);
	});
	return get_guild_integration_assets;
}

async function fetchGuildChannel(client, channel) {
	let get_guild_channel;
	await channel.fetch(true).then(async (got_guild_channel) => {
		get_guild_channel = got_guild_channel;
	}).catch((error) => {
		//console.log(error);
	});
	return get_guild_channel;
}

async function fetchGuildChannelInvites(client, channel) {
	let get_guild_channel_invites;
	await channel.fetchInvites().then(async (got_guild_channel_invites) => {
		get_guild_channel_invites = got_guild_channel_invites;
	}).catch((error) => {
		//console.log(error);
	});
	return get_guild_channel_invites;
}

async function fetchGuildChannelWebhooks(client, channel) {
	let get_guild_channel_webhooks;
	if (channel.isText()) {
		await channel.fetchWebhooks().then(async (got_guild_channel_webhooks) => {
			get_guild_channel_webhooks = got_guild_channel_webhooks;
		}).catch((error) => {
			//console.log(error);
		});
	}
	return get_guild_channel_webhooks;
}

async function fetchGuildInvites(client, guild) {
	let get_guild_invites;
	await guild.fetchInvites().then(async (got_guild_invites) => {
		get_guild_invites = got_guild_invites;
	}).catch((error) => {
		//console.log(error);
	});
	return get_guild_invites;
}

async function fetchGuildMember(client, guild, id) {
	let get_guild_member;
	await guild.members.fetch({user: id, cache: true, force: true, time: 999999999}).then(async (got_guild_member) => {
		get_guild_member = got_guild_member;
	}).catch((error) => {
		//console.log(error);
	});
	return get_guild_member;
}

async function fetchGuildMembers(client, guild) {
	let get_guild_members;
	await guild.members.fetch({cache: true, force: true, time: 999999999}).then(async (got_guild_members) => {
		get_guild_members = got_guild_members;
	}).catch((error) => {
		//console.log(error);
	});
	return get_guild_members;
}

async function fetchGuildRoles(client, guild) {
	let get_guild_roles;
	await guild.members.fetch(undefined, true, true).then(async (got_guild_roles) => {
		get_guild_roles = got_guild_roles;
	}).catch((error) => {
		//console.log(error);
	});
	return get_guild_roles;
}

async function fetchGuildTemplates(client, guild) {
	let get_guild_template;
	await guild.fetchTemplates().then(async (got_guild_template) => {
		get_guild_template = got_guild_template;
	}).catch((error) => {
		//console.log(error);
	});
	return get_guild_template;
}

async function fetchGuildVanityData(client, guild) {
	let get_guild_vanity_data;
	await guild.fetchVanityData().then(async (got_guild_vanity_data) => {
		get_guild_vanity_data = got_guild_vanity_data;
	}).catch((error) => {
		//console.log(error);
	});
	return get_guild_vanity_data;
}

async function fetchGuildVoiceRegions(client, guild) {
	let get_guild_voice_regions;
	await guild.fetchVoiceRegions().then(async (got_guild_voice_regions) => {
		get_guild_voice_regions = got_guild_voice_regions;
	}).catch((error) => {
		//console.log(error);
	});
	return get_guild_voice_regions;
}

async function fetchGuildWebhooks(client, guild) {
	let get_guild_webhooks;
	await guild.fetchWebhooks().then(async (got_guild_webhooks) => {
		get_guild_webhooks = got_guild_webhooks;
	}).catch((error) => {
		//console.log(error);
	});
	return get_guild_webhooks;
}

async function fetchGuildWidget(client, guild) {
	let get_guild_widget;
	await guild.fetchWidget().then(async (got_guild_widget) => {
		get_guild_widget = got_guild_widget;
	}).catch((error) => {
		//console.log(error);
	});
	return get_guild_widget;
}
/* GUILD */

module.exports = {
	
	/* APPLICATION */
	getApplication: fetchApplication,
	getApplicationAssets: fetchApplicationAssets,
	/* APPLICATION */
	
	/* CHANNEL */
	getChannel: fetchChannel,
	getChannelMessages: fetchChannelMessages,
	/* CHANNEL */
	
	/* CLIENT */
	getGuild: fetchGuild,
	getGuildTemplate: fetchGuildTemplate,
	getInvite: fetchInvite,
	getVoiceRegions: fetchVoiceRegions,
	getWebhook: fetchWebhook,
	/* CLIENT */
	
	/* MESSAGE */
	getMessage: fetchMessage,
	getMessageReaction: fetchMessageReaction,
	getMessageUserReactions: fetchMessageUserReactions,
	/* MESSAGE */
	
	/* GUILD */
	getGuildBan: fetchGuildBan,
	getGuildBans: fetchGuildBans,
	getGuildChannel: fetchGuildChannel,
	getGuildChannelInvites: fetchGuildChannelInvites,
	getGuildChannelWebhooks: fetchGuildChannelWebhooks,
	getGuildIntegrations: fetchGuildIntegrations,
	getGuildIntegrationAssets: fetchGuildIntegrationAssets,
	getGuildInvites: fetchGuildInvites,
	getGuildMember: fetchGuildMember,
	getGuildMembers: fetchGuildMembers,
	getGuildPreview: fetchGuildPreview,
	getGuildRoles: fetchGuildRoles,
	getGuildTemplates: fetchGuildTemplates,
	getGuildVanityData: fetchGuildVanityData,
	getGuildVoiceRegions: fetchGuildVoiceRegions,
	getGuildWebhooks: fetchGuildWebhooks,
	getGuildWidget: fetchGuildWidget,
	/* GUILD */
	
	/* USER */
	getUser: fetchUser,
	getUserFlags: fetchUserFlags,
	/* USER */
};
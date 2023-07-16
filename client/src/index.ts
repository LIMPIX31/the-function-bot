import { configDotenv } from 'dotenv'
import { Client, GatewayIntentBits, Partials } from 'discord.js'
import { l } from '@fn/helpers'

configDotenv()

export const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildMessageReactions,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildWebhooks,
		GatewayIntentBits.MessageContent,
	],
	partials: [Partials.Channel, Partials.Message, Partials.Reaction, Partials.User, Partials.GuildMember],
})

// eslint-disable-next-line dot-notation
await client.login(process.env['BOT_TOKEN'])

l(() => import('@fn/roles-assignment'))

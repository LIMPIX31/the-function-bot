import { importClient } from '@fn/helpers'
import {
	ActionRowBuilder,
	EmbedBuilder,
	Events,
	GuildMember,
	StringSelectMenuBuilder,
	StringSelectMenuInteraction,
	StringSelectMenuOptionBuilder,
} from 'discord.js'

const allowedRolesIds = {
	stack: {
		frontend: '1130057923465322496',
		backend: '1130057988628033586',
		fullstack: '1130058027014303767',
	},
	equipment: {
		laptop: '1130059596346695701',
		desktop: '1130059176190693416',
	},
}

interface RoleOption {
	roleId: string
	label: string
	description: string
}

const stackRoleOptions = [
	{
		roleId: allowedRolesIds.stack.frontend,
		label: 'Frontend',
		description: "I'm developing cool web apps",
	},
	{
		roleId: allowedRolesIds.stack.backend,
		label: 'Backend',
		description: 'I can develop great business logic and apis',
	},
	{
		roleId: allowedRolesIds.stack.fullstack,
		label: 'Fullstack',
		description: 'I can in frontend, backend and devops',
	},
].map(createOption)

function createOption({ roleId, label, description }: RoleOption) {
	return new StringSelectMenuOptionBuilder().setDescription(description).setLabel(label).setValue(roleId)
}

const equipmentRoleOptions = [
	{
		roleId: allowedRolesIds.equipment.laptop,
		label: 'Laptop',
		description: "I'm using a laptop",
	},
	{
		roleId: allowedRolesIds.equipment.desktop,
		label: 'Desktop',
		description: "I'm using a desktop",
	},
].map(createOption)

const stackRolesSelect = new StringSelectMenuBuilder()
	.setCustomId('stack_roles')
	.setPlaceholder('Select your stack role')
	.addOptions(...stackRoleOptions)

const equipmentRolesSelect = new StringSelectMenuBuilder()
	.setCustomId('equipment_roles')
	.setPlaceholder('Select your equipment role')
	.addOptions(...equipmentRoleOptions)

function mentionRole(roleId: string) {
	return `<@&${roleId}>`
}

const { client } = await importClient()

const channel = await client.channels.fetch('1130075654818381834')

if (channel && channel.isTextBased()) {
	const message = await channel.messages.fetch('1130096931843084329')

	const row1 = new ActionRowBuilder().addComponents(equipmentRolesSelect)
	const row2 = new ActionRowBuilder().addComponents(stackRolesSelect)

	await message.edit({
		embeds: [
			new EmbedBuilder()
				.setColor('#ff3c00')
				.addFields(
					{
						name: 'Equipment',
						value: `
**Laptop** - ${mentionRole(allowedRolesIds.equipment.laptop)}
**Desktop** - ${mentionRole(allowedRolesIds.equipment.desktop)}
					`.trim(),
						inline: true,
					},
					{
						name: 'Stack',
						value: `
**Frontend** - ${mentionRole(allowedRolesIds.stack.frontend)}
**Backend** - ${mentionRole(allowedRolesIds.stack.backend)}
**Fullstack** - ${mentionRole(allowedRolesIds.stack.fullstack)}
					`.trim(),
						inline: true,
					},
				)
				.setTitle('Roles'),
		],
		components: [row1 as any, row2],
	})
}

function successfullyAsigned(interaction: StringSelectMenuInteraction, roleId: string) {
	return interaction.reply({
		ephemeral: true,
		embeds: [
			new EmbedBuilder().setColor('Green').setTitle('Role assigned successfully').setDescription(mentionRole(roleId)),
		],
	})
}

function failedToAssign(interaction: StringSelectMenuInteraction) {
	return interaction.reply({
		ephemeral: true,
		embeds: [new EmbedBuilder().setColor('Green').setTitle('Failed to assign role')],
	})
}

client.on(Events.InteractionCreate, async (interaction) => {
	if (!interaction.isStringSelectMenu()) {
		return
	}

	const { customId, values, member } = interaction

	if (!member || !(member instanceof GuildMember)) {
		return
	}

	switch (customId) {
		case 'equipment_roles':
			{
				const [roleId] = values
				if (!roleId) {
					return
				}
				try {
					await member.roles.remove(Object.values(allowedRolesIds.equipment))
					await member.roles.add(roleId)
					await successfullyAsigned(interaction, roleId)
				} catch (e: any) {
					await failedToAssign(interaction)
				}
			}
			break
		case 'stack_roles':
			{
				const [roleId] = values
				if (!roleId) {
					return
				}
				try {
					await member.roles.remove(Object.values(allowedRolesIds.stack))
					await member.roles.add(roleId)
					await successfullyAsigned(interaction, roleId)
				} catch (e: any) {
					await failedToAssign(interaction)
				}
			}
			break
	}
})

export {}

const { Client, CommandInteraction, InteractionType, EmbedBuilder } = require("discord.js")
const { ApplicationCommand } = InteractionType
const BlacklistGuildDB = require("../../Structures/Schemas/BlacklistG")
const BlacklistUserDB = require("../../Structures/Schemas/BlacklistU")
const Reply = require("../../Systems/Reply")

module.exports = {
    name: "interactionCreate", 

    /**
     * @param {CommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {

        const { user, guild, commandName, member, type } = interaction

        if (!guild || user.bot) return

        if (type !== ApplicationCommand) return

        const command = client.commands.get(commandName)

        const BlackListGuildData = await BlacklistGuildDB.findOne({ Guild: guild.id }).catch(err => {})
        const BlackListUserData = await BlacklistUserDB.findOne({ User: user.id }).catch(err => {})

        const Embed = new EmbedBuilder()
            .setColor(client.color)
            .setThumbnail(guild.iconURL())
            .setTimestamp()
            .setFooter({ text: "Blacklisted by Starcade" })

        if (BlackListGuildData) return interaction.reply({
            embeds: [
                Embed
                    .setTitle("Server Blacklisted")
                    .setDescription(`Your server has been blacklisted from our bot <t:${parseInt(BlackListGuildData.Time / 1000)}:R> ago. For the reason \`${BlackListGuildData.Reason}\`.`)
            ], 
            ephemeral: true
        })

        if (BlackListUserData) return interaction.reply({
            embeds: [
                Embed
                    .setTitle("User Blacklisted")
                    .setDescription(`You have been blacklisted from our bot <t:${parseInt(BlackListUserData.Time / 1000)}:R> ago. For the reason \`${BlackListUserData.Reason}\`.`)
            ], ephemeral: true
        })

        if (!command) return Reply(interaction, "❌", "An error occured while running this command!", true) && client.commands.delete(commandName)

        if (command.UserPerms && command.UserPerms.length !== 0) if (!member.permissions.has(command.UserPerms)) return Reply (interaction, "❌", `You need \`${command.UserPerms.join(", ")}\` to run this command!`, true)

        if (command.BotPerms && command.BotPerms.length !== 0) if (!member.permissions.has(command.BotPerms)) return Reply (interaction, "❌", `I need \`${command.BotPerms.join(", ")}\` to run this command!`, true)

        command.execute(interaction, client)
    }
}
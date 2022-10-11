const { Client, ChatInputCommandInteraction, PermissionOverwriteManager } = require("discord.js"); 
const EditReply = require("../../Systems/EditReply")

module.exports = {
    name: "unlock",
    description: "Unlock a Channel",
    UserPerms: ["ManageChannels"],
    BotPerms: ["ManageChannels"],
    category: "Moderation",
    options: [
        {
            name: "channel", 
            description: "Select the channel to unlock", 
            type: 7,
            required: true
        }
    ],

    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {

        await interaction.deferReply({ ephemeral: true })

        const { options, guild } = interaction 
        
        const Channel = options.getChannel("channel")

        Channel.permissionOverwrites.edit(guild.roles.everyone, { SendMessages: null })

        EditReply(interaction, "✅", `Successfully unlocked ${Channel}`)
        
    }
}
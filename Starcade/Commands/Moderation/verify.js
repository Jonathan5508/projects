const { Client, ChatInputCommandInteraction, ButtonBuilder, ActionRowBuilder, ButtonStyle, EmbedBuilder, Embed } = require("discord.js"); 
const DB = require("../../Structures/Schemas/Verification")
const EditReply = require("../../Systems/EditReply")

module.exports = {

    name: "verify", 
    description: "Verification System", 
    UserPerms: ["ManageGuild"],
    category: "Moderation", 
    options: [
        {
            name: "role", 
            description: "Select the Verified Members role",
            type: 8,
            required: true
        },
        {
            name: "channel", 
            description: "Select the channel where the message will be sent",
            type: 7,
            required: false
        },
    ],

    /**
     * @param {Client} client
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {

        await interaction.deferReply({ ephemeral: true })

        const { options, guild, channel } = interaction

        const role = options.getRole("role")
        const Channel = options.getChannel("channel") || channel

        let Data = await DB.findOne({ Guild: guild.id }).catch(err => { })

        if (!Data) {

            Data = new DB({

                Guild: guild.id,
                Role: role.id
            })

            await Data.save()
        } else {

            Data.Role = role.id
            await Data.save()

        }

        Channel.send({

            embeds: [

                new EmbedBuilder()
                    .setColor(client.color)
                    .setTitle("✅ | Verification")
                    .setDescription("Click the button below to verify!")
                    .setTimestamp()
            ], 
            components: [
                new ActionRowBuilder().setComponents(

                    new ButtonBuilder()
                        .setCustomId("verify")
                        .setLabel("Verify")
                        .setStyle(ButtonStyle.Secondary)
                )
            ]
        })

        return EditReply(interaction, "✅", `Successfuly sent verification panel in ${Channel}!`)
    }
}
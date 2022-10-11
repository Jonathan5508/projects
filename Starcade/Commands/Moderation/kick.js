const { Client, ChatInputCommandInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require("discord.js"); 
const ms = require("ms")
const EditReply = require("../../Systems/EditReply")


module.exports = {

    name: "kick", 
    description: "Kicks a member from the server", 
    UserPerms: ["KickMembers"],
    BotPerms: ["KickMember"],
    category: "Moderation", 
    options: [
        {
            name: "user", 
            description: "Select a user",
            type: 6,
            required: true,
        },
        {
            name: "reason", 
            description: "Specify a reason to kick",
            type: 3,
            required: false,
        },
    ],

    /**
     * @param {Client} client
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {

        await interaction.deferReply({ ephemeral: true })

        const { options, user, guild } = interaction

        const member = options.getMember("user")
        const reason = options.getString("reason") || "no reason provided"

        if (member.id === user.id) return EditReply(interaction, "❌", "You cannot kick yourself!")
        if (guild.ownerId === member.id) return EditReply(interaction, "❌", "You cannot kick the Server Owner!")
        if (guild.members.me.roles.highest.position <= member.roles.highest.position) return EditReply(interaction, "❌", "You cannot kick a member that has the same level or higher an you!")
        if (interaction.member.roles.highest.position <= member.roles.highest.position) return EditReply(interaction, "❌", "I cannot kick a member that has the same level or higher an you!")

        const Embed = new EmbedBuilder()
            .setColor(client.color)

        const row = new ActionRowBuilder().addComponents(
            
            new ButtonBuilder()
                .setStyle(ButtonStyle.Danger)
                .setCustomId("kick-yes")
                .setLabel("Yes"), 

            new ButtonBuilder()
                .setStyle(ButtonStyle.Primary)
                .setCustomId("kick-no")
                .setLabel("No"),
        )

        const Page = await interaction.editReply({

            embeds: [
                Embed.setDescription("**⚠ | Do you really want to kick this member?**")
            ],
            components: [row]
        })

        const col = Page.createMessageComponentCollector({
            componentType: ComponentType.Button,
            type: ms("15s"),
        })

        col.on("collect", i => {
            
            if (i.user.id !== user.id) return 

            switch(i.customId){

                case "kick-yes": {
                    
                    member.kick({reason})

                    interaction.editReply({
                        embeds: [
                            Embed.setDescription(`✅ | ${member} has been kicked for: **${reason}**.`)
                        ], 
                        components: []
                    })

                    member.send({
                        embeds: [
                            new EmbedBuilder()
                                .setColor(client.color)
                                .setDescription(`You have been kicked from ${guild.name} for: **${reason}**`)
                        ]
                    }).catch(err => {

                        if (err.code !== 50007) return console.log(err)

                    })
                }

                    break;

                case "kick-no": {

                    interaction.editReply({
                        embeds: [
                            Embed.setDescription(`✅ | Kick request cancelled.`)
                        ], 
                        components: []
                    })
                }
                    break;
            }
        })

        col.on("end", (collected) => {

            if (collected.size > 0) return

            interaction.editReply({
                embeds: [
                    Embed.setDescription(`❌ | You did not provide a valid response in time!`)
                ], 
                components: []
            })
        })
    }
}
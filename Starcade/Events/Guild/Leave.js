const { Client, GuildMember, EmbedBuilder } = require("discord.js")
const DB = require("../../Structures/Schemas/Leave")

module.exports = { 
    name: "guildMemberRemove",

    /**
     * @param {GuildMember} member 
     * @param {Client} client 
     */
    async execute(member, client) {

        const { user, guild } = member

        const Data = await DB.findOne({ Guild: guild.id }).catch(err => { })
        if (!Data) return 

        const Message = `${member} has left ${guild.name}`

        if (Data.Channel !== null) {

            const Channel = guild.channels.cache.get(Data.Channel)
            if (!Channel) return 

            const Embed = new EmbedBuilder()
                .setColor(client.color)
                .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() })
                .setDescription(`${member} has left us. Hope they will be back soon!`)
                .setThumbnail(user.displayAvatarURL())
                .setFooter({text: "Leave by Starcade"})
                .setTimestamp()

            Channel.send({ content: `${Message}`, embeds: [Embed] })
        }
    }
}
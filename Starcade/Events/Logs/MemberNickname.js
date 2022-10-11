const { Client, GuildMember, EmbedBuilder } = require("discord.js")
const DB = require("../../Structures/Schemas/LogsChannel")
const SwitchDB = require("../../Structures/Schemas/GeneralLogs")


module.exports = {
    name: "guildMemberUpdate", 

    /**
     * @param {GuildMember} oldMember
     * @param {GuildMember} newMember
     * @param {Client} client 
     */
    async execute(oldMember, newMember, client) {
        const { guild, user } = newMember

        const data = await DB.findOne({ Guild: guild.id }).catch(err => { })
        const Data = await SwitchDB.findOne({ Guild: guild.id }).catch(err => { })

        if (!Data) return
        if (Data.MemberNick === false) return
        if (!data) return

        const logsChannel = data.Channel

        const Channel = await client.channels.cache.get(logsChannel)
        if(!Channel) return

        const Embed = new EmbedBuilder()
            .setColor(client.color)
            .setThumbnail(guild.iconURL())
            .setFooter({ text: "Logged by Starcade"})
            .setTimestamp()

        if (newMember.nickname !== oldMember.nickname) {

            return Channel.send({
                embeds: [
                    Embed
                        .setTitle("Nickname Update")
                        .setDescription(`**${newMember.user.tag}** has changed their nickname from \`${oldMember.nickname}\` to \`${newMember.nickname}\``)
                ]
            })
        } 
    }
}
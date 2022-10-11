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
        if (Data.MemberBoost === false) return
        if (!data) return

        const logsChannel = data.Channel

        const Channel = await client.channels.cache.get(logsChannel)
        if(!Channel) return

        const oldRoles = oldMember.roles.cache.map(r => r.id)
        const newRoles = newMember.roles.cache.map(r => r.id)

        const Embed = new EmbedBuilder()
            .setColor(client.color)
            .setThumbnail(guild.iconURL())
            .setFooter({ text: "Logged by Starcade"})
            .setTimestamp()

        if (!oldMember.premiumSince && newMember.premiumSince) {

            return Channel.send({
                embeds: [
                    Embed
                        .setTitle("Boost Detected")
                        .setDescription(`**${newMember.user.tag}** has started boosting the server!`)
                ]
            })
        } else if (!newMember.premiumSince && oldMember.premiumSince) {

            const RoleID = Unique(oldRoles, newRoles)
            const Role = guild.roles.cache.get(RoleID[0].toString())

            return Channel.send({
                embeds: [
                    Embed
                        .setTitle("Unboost Detected")
                        .setDescription(`**${newMember.user.tag}** has stopped boosting the server.`)
                ]
            })
        } else return
    }
}
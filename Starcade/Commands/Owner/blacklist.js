const { Client, ChatInputCommandInteraction } = require("discord.js"); 
const DBG = require("../../Structures/Schemas/BlacklistG")
const DBU = require("../../Structures/Schemas/BlacklistU")
const EditReply = require("../../Systems/EditReply")

module.exports = {
    name: "blacklist",
    description: "Blacklist a member or server",
    UserPerms: ["Administrator"],
    BotPerms: ["Administrator"],
    category: "Owner",
    options: [
        {
            name: "options", 
            description: "Choose an option", 
            type: 3, 
            required: true, 
            choices: [
                {
                    name: "Server", 
                    value: "server"
                },
                {
                    name: "Member", 
                    value: "member"
                }
            ]
        }, 
        {
            name: "id", 
            description: "Provide the User ID or the guild ID", 
            type: 3, 
            required: true
        }, 
        {
            name: "reason", 
            description: "Provide the reason", 
            type: 3, 
            required: false
        },
    ],

    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {

        await interaction.deferReply({ ephemeral: true })

        const { user, options } = interaction 

        if (user.id !== "927200461377929246") return EditReply(interaction, "❌", "This command is only accessible to the Owner!")

        const Options = options.getString("options")
        const ID = options.getString("id")
        const Reason = options.getString("reason") || "No Reason Provided"

        if (isNaN(ID)) return EditReply(interaction, "❌", "The ID is supposed to be a number!")

        switch (Options) {
            case "server": {

                const Guild = client.guilds.cache.get(ID)

                let GName
                let GID

                if (Guild) {

                    GName = Guild.name,
                    GID = Guild.id
                } else {

                    GName = "Unknown",
                    GID = ID
                }

                let Data = await DBG.findOne({ Guild: GID }).catch(err => { })

                if (!Data) {

                    Data = new DBG({
                        Guild: GID, 
                        Reason, 
                        Time: Date.now()
                    })

                    await Data.save()

                    EditReply(interaction, "✅", `Successfully added \`${GName}\` (\`${GID}\`) to blacklisted servers. Blacklisted for \`${Reason}\``)
                } else {

                    await Data.delete()

                    EditReply(interaction, "✅", `Successfully removed \`${GName}\` (\`${GID}\`) from blacklisted servers. `)
                }
            }
                break;

            case "member": {

                let Member
                let MName
                let MID

                const User = client.users.cache.get(ID)

                if (User) {
                    Member = User
                    MName = User.tag
                    MID = User.id
                } else {
                    Member = "Unknown User #0000"
                    MName = "Unknown User #0000"
                    MID = ID
                }

                let Data = await DBU.findOne({ User: MID }).catch(err => { })

                if (!Data) {

                    Data = new DBU({
                        User: MID, 
                        Reason, 
                        Time: Date.now()
                    })

                    await Data.save()

                    EditReply(interaction, "✅", `Successfully added ${Member} (\`${MName}\` | \`${MID}\`) to the user blacklist. Blacklisted for \`${Reason}\`.`)
                } else {

                    await Data.delete()

                    EditReply(interaction, "✅", `Successfully removed ${Member} (\`${MName}\` | \`${MID}\`) from the user blacklist.`)
                }
            }
                break;
        }
    }
}
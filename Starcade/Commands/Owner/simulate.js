const { Client, ChatInputCommandInteraction } = require("discord.js"); 
const EditReply = require("../../Systems/EditReply")


module.exports = {
    name: "simulate",
    description: "Simulate the welcome message",
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
                    name: "Join", 
                    value: "join"
                },
                {
                    name: "Leave", 
                    value: "leave"
                }
            ]
        }
    ],

    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {

        await interaction.deferReply({ ephemeral: true })

        const { options, user, member } = interaction 

        const Options = options.getString("options")

        if (user.id !== "927200461377929246") return EditReply(interaction, "❌", "This command is only accessible to the Owner!")

        switch(Options) {

            case "join": {

                EditReply(interaction, "✅", "Simulated Join Event")

                client.emit("guildMemberAdd", member)
            }

                break;

            case "leave": {
                EditReply(interaction, "✅", "Simulated Leave Event")

                client.emit("guildMemberRemove", member)
            }
                break;
        }
    }
}
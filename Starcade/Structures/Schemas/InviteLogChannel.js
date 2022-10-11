const { model, Schema } = require("mongoose")

module.exports = model("inviteLogChannel", new Schema({
    Guild: String, 
    Channel: String
}))
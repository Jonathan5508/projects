const { model, Schema } = require("mongoose")

module.exports = new model("leave", new Schema({

    Guild: String, 
    Channel: String,
}))
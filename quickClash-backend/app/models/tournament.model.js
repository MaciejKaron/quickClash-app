const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')


module.exports = () => {
    var schema = mongoose.Schema(
        {
            title: String,
            description: String,
            mode: String,
            level: String,
            published: Boolean,
            premium: Boolean,
            startTime: Date,
            image: String,
            slots: String,
            stage: {
                stage2: [{type: mongoose.Schema.Types.ObjectId, ref:"User"}],
                stage3: [{type: mongoose.Schema.Types.ObjectId, ref:"User"}],
                stage4: [{type: mongoose.Schema.Types.ObjectId, ref:"User"}],
                stage5: [{type: mongoose.Schema.Types.ObjectId, ref:"User"}],
        },
            players: [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User"
                }
            ],
            teams: [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Team"
                }
            ]
        },
        { timestamps: true}
    )

    schema.plugin(mongoosePaginate)

    const Tournament = mongoose.model("Tournament", schema)
    return Tournament
}

// const Tournament = mongoose.model("Tournament",
//     new mongoose.Schema({
//         title: String,
//         description: String,
//         published: Boolean,
//     },
//         { timestamps: true }
//     ))

//     module.exports = Tournament
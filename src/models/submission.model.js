const mongoose = require("mongoose")

const submissionSchema = new mongoose.Schema(
    {
        userID: {
            type: String,
            required: true,
        },
        quizID: {
            type: String,
            required: true
        },
        score: {
            type: Number,
            required: true
        }
    },
    { timestamps: true }
)

module.exports = mongoose.model("submission", submissionSchema)
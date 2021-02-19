const mongoose = require("mongoose")
const validator = require("validator")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const Task = require("./order")

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            unique: true,
            required: true,
            trim: true,
            lowercase: true,
            validate(value) {
                if (!validator.isEmail(value)) {
                    throw new Error("Email is invalid")
                }
            }
        },
        password: {
            type: String,
            required: true,
            minlength: 6,
            trim: true,
            validate(value) {
                if (value.toLowerCase().includes("password")) {
                    throw new Error('Password cannot contain "password"')
                }
            }
        },
        tokens: [
            {
                token: {
                    type: String,
                    required: true
                }
            }
        ]
    },
    {
        timestamps: true
    }
)

userSchema.virtual("orders", {
    ref: "Order",
    localField: "_id",
    foreignField: "owner"
})

userSchema.pre("save", async function (next) {
    const user = this

    if (user.isModified("password")) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})

// userSchema.pre('remove', async function (next) {
//     const user = this
//     await Task.deleteMany({ owner: user._id })
//     next()
// })

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email })

    if (!user) {
        throw new Error()
    }

    const isMatch = bcrypt.compare(password, user.password)

    if (!isMatch) {
        throw new Error()
    }

    return user
}

userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens

    return userObject
}

userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET)

    user.tokens = user.tokens.concat({ token })
    await user.save()

    return token
}

const User = mongoose.model("User", userSchema)

module.exports = User

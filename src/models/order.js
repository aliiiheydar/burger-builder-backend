const mongoose = require("mongoose")

const orderSchema = new mongoose.Schema(
    {
        ingredients: {
            type: Object,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        orderData: {
            type: Object,
            required: true
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User"
        }
    },
    {
        timestamps: true
    }
)

const Order = mongoose.model("Order", orderSchema)

module.exports = Order

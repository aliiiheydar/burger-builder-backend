const express = require("express")
const cors = require("cors")
require("./db/mongoose")
const userRouter = require("./routers/user")
const orderRouter = require("./routers/order")
const ingredientsRouter = require("./routers/ingredients")

const app = express()
const port = process.env.PORT

app.use(cors())
app.use(express.json())
app.use(orderRouter)
app.use(userRouter)
app.use(ingredientsRouter)

app.listen(port, () => {
    console.log("Server is up on port " + port)
})

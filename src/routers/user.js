const express = require("express")
const User = require("../models/user")
const auth = require("../middleware/auth")

const router = new express.Router()

router.post("/users/signup", async (req, res) => {
    try {
        const user = new User(req.body)
        const token = await user.generateAuthToken()
        res.status(201).send({ userId: user._id, token })
    } catch (e) {
        let error = null
        if (e.message) {
            error = { message: "Password is short" }
        }
        if (e.keyValue) {
            error = { message: "This email is taken" }
        }
        res.status(400).send(error)
    }
})

router.post("/users/signin", async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({ userId: user._id, token })
    } catch (e) {
        res.status(400).send({ message: "Unable to signin" })
    }
})

router.post("/users/logout", auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()

        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

// router.get("/users/me", auth, async (req, res) => {
//     res.send(req.user)
// })

module.exports = router

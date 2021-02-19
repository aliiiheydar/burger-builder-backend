const express = require("express")

const router = new express.Router()

const ingredients = {
    salad: 0,
    bacon: 0,
    cheese: 0,
    meat: 0
}

router.get("/ingredients", (req, res) => {
    res.send(ingredients)
})

module.exports = router

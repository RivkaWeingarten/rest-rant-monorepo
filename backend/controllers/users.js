const router = require('express').Router()
const db = require("../models")
const bcrypt = require('bcrypt')
const { User } = db

router.post('/', async (req, res) => {
    let { password, ...rest } = req.body;
    const user = await User.create({
        ...rest,
        passwordDigest: await bcrypt.hash(password,10)
    })

    res.json(user)
})

router.post('/', async (req, res) => {
    
    let user = await User.findOne({
        where: { 
            email: req.body.email          
        }
    })

    if (!user || !await bcrypt.compare(req.body.password, user.passwordDigest)) {
        res.status(404).json({ 
            message: `Could not find a user with the provided username and password` 
        })
    } else {
        res.json({ user })
    }
})


router.get('/', async (req, res) => {
    const users = await User.findAll()
    res.json(users)
})

module.exports = router
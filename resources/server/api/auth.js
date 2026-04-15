const express = require('express')
const { userStore } = require('../utils/stores')
const authorize = require('../utils/authorize')
const authRouter = express.Router()

const adminOnly = authorize(['admin'])
const anyRole = authorize(['superadmin', 'admin', 'user'])

authRouter.get('/profile', anyRole, (req, res) => {
  if (req.user) {
    res.status(200).json(req.user)
  } else {
    res.status(404).send('User does not exist')
  }
})

authRouter.post('/register', adminOnly, (req, res) => {
  const { name, email, password } = req.body
  if (!name || !email || !password) {
    return res.status(400).send('Name, email and password are required')
  }

  if (password.length < 8) {
    return res.status(400).send('Password must be at least 8 characters long')
  }
  const newUser = { name, email, password, role: 'user', active: false }
  userStore.insert(newUser, (err, doc) => {
    if (err) {
      return res.status(500).send(`Error creating user ${err.message}`)
    }
    res.status(201).json(doc)
  })
})

authRouter.get('/login', (req, res) => {
  const { email, password } = req.query
  if (!email || !password) {
    return res.status(400).send('Email and password is required')
  }
  if (password.length < 8) {
    return res.status(400).send('Password must be at least 8 characters long')
  }
  userStore.findOne({ email, password }, (err, doc) => {
    if (err) {
      return res.status(500).send('Error logging in')
    }
    if (!doc) {
      return res.status(401).send('Invalid email or password')
    }
    res.json(doc)
  })
})

module.exports = authRouter

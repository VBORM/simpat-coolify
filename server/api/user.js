const express = require('express')
const { userStore } = require('../utils/stores')
const authorize = require('../utils/authorize')
const userRouter = express.Router()

const adminOnly = authorize(['superadmin', 'admin'])
const superOnly = authorize(['superadmin'])
const anyRole = authorize(['superadmin', 'admin', 'user'])

userRouter.get('/', adminOnly, (req, res) => {
  userStore.find({}, (err, docs) => {
    if (err) {
      return res.status(500).send('Error retrieving users')
    }
    docs.forEach((doc) => {
      delete doc.password
    })
    res.json(docs)
  })
})

userRouter.post('/', adminOnly, (req, res) => {
  const { name, email, password, role } = req.body
  if (!name || !email || !password) {
    return res.status(400).send('Name, email and password are required')
  }
  if (!['admin', 'user'].includes(role)) {
    return res.status(400).send('Role must be either admin or user')
  }
  if (password.length < 8) {
    return res.status(400).send('Password must be at least 8 characters long')
  }
  const newUser = { name, email, password, role, active: false }
  userStore.insert(newUser, (err, doc) => {
    if (err) {
      return res.status(500).send(`Error creating user ${err.message}`)
    }
    res.status(201).json(doc)
  })
})

userRouter.put('/:userId', anyRole, (req, res) => {
  const userId = req.params.userId
  if (!userId) {
    return res.status(400).send('User ID is required')
  }
  const { name, email, password, active, role } = req.body
  if (password && password.length < 8) {
    return res.status(400).send('Password must be at least 8 characters long')
  }
  if (role && !['admin', 'user'].includes(role)) {
    return res.status(400).send('Role must be either admin or user')
  }
  const updates = { name, email, password, active, role }
  Object.keys(updates).forEach((key) => {
    if (updates[key] === undefined) {
      delete updates[key]
    }
  })
  userStore.update({ _id: userId }, { $set: updates }, {}, (err, numReplaced) => {
    if (err) {
      return res.status(500).send(`Failed to update user: ${err.message}`)
    }
    if (numReplaced === 0) {
      return res.status(404).send('User does not exist')
    }
    res.json({ success: true })
  })
})

userRouter.delete('/:userId', superOnly, (req, res) => {
  const userId = req.params.userId
  if (!userId) {
    return res.status(400).send('User ID is required')
  }
  userStore.remove({ _id: userId, role: { $ne: 'superadmin' } }, {}, (err, numRemoved) => {
    if (err) {
      return res.status(500).send(`Failed to delete user: ${err.message}`)
    }
    if (numRemoved === 0) {
      return res.status(404).send('User does not exist')
    }
    res.json({ success: true })
  })
})

module.exports = userRouter

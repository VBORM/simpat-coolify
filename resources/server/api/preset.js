const express = require('express')
const authorize = require('../utils/authorize')
const { userStore, presetStore } = require('../utils/stores')
const presetRouter = express.Router()

const anyRole = authorize(['admin', 'user'])

presetRouter.get('/', anyRole, (req, res) => {
  const query = {}
  if (req.user.role !== 'admin') {
    query.userId = req.user._id
  }
  presetStore.find(query, (err, presetDocs) => {
    if (err) {
      return res.status(500).send('Failed to retrieve presets')
    }
    if (query.userId) {
      return res.json(presetDocs)
    }
    userStore.find({}, (err, userDocs) => {
      if (err) {
        return res.status(500).send('Failed to retrieve users')
      }
      const userPresetMap = {}
      userDocs.forEach((user) => {
        userPresetMap[user._id] = { user, presets: [] }
      })
      presetDocs.forEach((preset) => {
        if (userPresetMap[preset.userId]) {
          userPresetMap[preset.userId].presets.push(preset)
        }
      })
      res.json(Object.values(userPresetMap))
    })
  })
})

presetRouter.post('/import', anyRole, (req, res) => {
  const presets = req.body
  if (!Array.isArray(presets)) {
    return res.status(400).json('Payload must be an array of presets')
  }
  presets.forEach((item, index) => {
    item.userId = req.user._id
    if (!item._name || !item.variables) {
      return res.status(400).send(`Preset name or variables key missing at index ${index}`)
    }
  })
  presetStore.insert(presets, (err, docs) => {
    if (err) {
      return res.status(500).send('Failed to import preset')
    }
    res.status(200).send(`Imported ${docs.length} presets.`)
  })
})

presetRouter.post('/', anyRole, (req, res) => {
  const { _name, variables } = req.body
  if (!_name || !variables) {
    return res.status(400).send('Preset name and variables are required')
  }
  const alreadyExistsQuery = { _name, userId: req.user._id }
  presetStore.findOne(alreadyExistsQuery, (err, existingPreset) => {
    if (err) {
      return res.status(500).send('Error checking existing presets')
    }
    if (existingPreset) {
      return res.status(400).send('Preset name already in use. Did you meant to update insated?')
    }
    const newPreset = { _name, variables, userId: req.user._id }
    presetStore.insert(newPreset, (err, doc) => {
      if (err) {
        return res.status(500).send('Failed to save preset')
      }
      res.status(201).json(doc)
    })
  })
})

presetRouter.patch('/:presetId', anyRole, (req, res) => {
  const presetId = req.params.presetId
  const { _name, variables } = req.body
  if (!presetId) {
    return res.status(400).send('Preset "_id" is required in payload')
  }
  if ((!_name && !variables) || (_name && variables)) {
    return res.status(400).send('Either "_name" or "variables" must be included in payload')
  }
  const updateData = {}
  if (_name) updateData._name = _name
  if (variables) updateData.variables = variables

  const query = { _id: presetId }
  if (req.user.role !== 'admin') {
    query.userId = req.user._id
  }
  presetStore.update(query, { $set: updateData }, {}, (err, numUpdated) => {
    if (err) {
      return res.status(500).send('Error updating preset')
    }
    if (numUpdated === 0) {
      return res.status(404).send('Preset not found or not authorized to update')
    }
    res.status(200).send('Preset updated successfully')
  })
})

presetRouter.delete('/:presetId', anyRole, (req, res) => {
  const presetId = req.params.presetId
  if (!presetId) {
    return res.status(400).send('Preset ID is required')
  }
  const query = { _id: presetId }
  if (req.user.role !== 'admin') {
    query.userId = req.user._id
  }
  presetStore.remove({ _id: presetId }, {}, (err, numRemoved) => {
    if (err) {
      return res.status(500).send('Error deleting preset')
    }
    if (numRemoved === 0) {
      return res.status(404).send('Preset not found')
    }
    res.status(200).send('Preset deleted successfully')
  })
})

module.exports = presetRouter

const Nedb = require('nedb')

const userStore = new Nedb({
  filename: 'db/users.nedb',
  autoload: true,
  corruptAlertThreshold: 0,
  onload: (err) => {
    if (err) {
      console.error('Failed to load user database')
      process.exit(0)
    }
    userStore.ensureIndex({ fieldName: 'email', unique: true }, (err) => {
      if (err) {
        console.error('Failed to create index for email')
        process.exit(0)
      }
    })
    userStore.insert({
      name: 'SimPaT Super Admin',
      email: 'superadmin@simpat.com',
      password: 'Password.123',
      role: 'superadmin',
      active: true
    })
    userStore.insert({
      name: 'SimPaT-25 Admin',
      email: 'admin@simpat.com',
      password: 'Password.123',
      role: 'admin',
      active: true
    })
  }
})

const presetStore = new Nedb({
  filename: 'db/presets.nedb',
  autoload: true,
  corruptAlertThreshold: 0,
  onload: (err) => {
    if (err) {
      console.log(err)
      console.error('Failed to load presets database')
      process.exit(0)
    }
  }
})

module.exports = {
  userStore,
  presetStore
}

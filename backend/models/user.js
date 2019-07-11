const mongoose = require('mongoose')
const Schema = mongoose.Schema
const crypto = require('crypto')
const config = require('../config')

const User = new Schema({
    username: String,
    password: String,
    email: String,
    admin: { type: Boolean, default: false }
})

// create new User document
User.statics.create = function( username, password, email, ) {
    const encrypted = crypto.createHmac('sha1', config.secret)
                        .update(password)
                        .digest('base64')
    const user = new this({
        username,
        password: encrypted,
        email
    })

    // return the Promise
    return user.save()
}

User.statics.findOneByUserName = function(username) {
    return this.findOne({
        username
    }).exec()
}

// verify the password of the User document
User.methods.verify = function(password) {
    const encrypted = crypto.createHmac('sha1', config.secret)
                        .update(password)
                        .digest('base64')
    return this.password === encrypted
}

User.methods.assignAdmin = function() {
    this.admin = true
    return this.save()
}

module.exports = mongoose.model('User', User)
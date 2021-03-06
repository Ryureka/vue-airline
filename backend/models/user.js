const mongoose = require('mongoose')
const Schema = mongoose.Schema
const crypto = require('crypto')
const config = require('../config')

const User = new Schema({
    id: {type: String, unique: true},
    nickname: String,
    profileImageUrl: String,
    email: {type: String, unique: true},

    username: String,
    // password: String,
    profileImg:String, // 일단 모델에만 추가
    registeredAt:{type: Date, default: Date.now}, // 일단 모델에만 추가(회원가입날짜)
    firstName: String,
    lastName: String,
    age: Number,
    gender: String,
    languages: [String],
    intro: String,
    UsedGuides: [{ type: Schema.Types.ObjectId, ref: 'guide'}],
    UsedGuideServices: [{ type: Schema.Types.ObjectId, ref: 'guideservice'}],
    likeGuideServices: [{ type: Schema.Types.ObjectId, ref: 'guideservice'}]
    // admin: { type: Boolean, default: false }
})

// create new User document
// User.statics.create = function( username, password, email, ) {
//     const encrypted = crypto.createHmac('sha1', config.secret)
//                         .update(password)
//                         .digest('base64')
//     const user = new this({
//         username,
//         password: encrypted,
//         email
//     })

//     // return the Promise
//     return user.save()
// }

User.statics.findOneByUserName = function(username) {
    return this.findOne({
        username
    }).exec()
}

User.statics.findOneById = function(id) {
    return this.findOne({_id:id}).exec()
}

// verify the password of the User document
User.methods.verify = function(password) {
    const encrypted = crypto.createHmac('sha1', config.secret)
                        .update(password)
                        .digest('base64')
    return this.password === encrypted
}

// User.methods.assignAdmin = function() {
//     this.admin = true
//     return this.save()
// }

User.methods.deleteUser = function( username ) {
    const user = User.findOneByUserName(username)
    return user.delete()
}


/*
    username: String,
    password: String,
    email: String,
    age: Number,
    gender: String,
    languages: [String],
    intro: String,
    UsedGuides: [{ type: Schema.Types.ObjectId, ref: 'guide'}],
    UsedGuideServices: [{ type: Schema.Types.ObjectId, ref: 'guideservice'}]
*/
// User.statics.updateByUserObId = function(username, password, email, age, gender, languages, intro, UsedGuides, UsedGuideServices) {
//     return this.findOneAndUpdate({

//     })
// }


User.statics.findOrCreate = function(condition, callback) {
    const {id, nickname, profileImageUrl} = condition
    condition = {...condition, username: nickname}
    this.findOneAndUpdate({id: id}, {nickname: nickname, profileImageUrl: profileImageUrl}, (err, user) => {
        if (user) {
            return callback(err, user)
        } else {
            this.create(condition, (err, user) => {
                return callback(err, user)
            })
        } 
    })
}
module.exports = mongoose.model('User', User)

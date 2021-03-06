const jwt = require('jsonwebtoken')
const User = require('../../../models/superUser')

/*
    POST /api/superauth/register
    {
        username,
        password,
        email
    }
*/

exports.register = (req, res) => {
    const { username, password, email } = req.body
    let newUser = null
    console.log('이건 수퍼유저 생성')
    console.log( username, password, email)
    console.log('')
    // create a new user if does not exist
    const create = (user) => {
        if(user) {
            throw new Error('username exists')
        } else {
            return User.create(username, password, email)
            
        }
    }

    // count the number of the user
    const count = (user) => {
        newUser = user
        return User.count({}).exec()
    }

    // assign admin if count is 1
    const assign = (count) => {
        if(count === 1) {
            return newUser.assignAdmin()
        } else {
            // if not, return a promise that return false
            return Promise.resolve(false)
        }
    }

    // respond to the client
    const respond = (isAdmin) => {
        res.json({
            message: 'registered successfully',
            admin: isAdmin ? true : false
        })
    }

    // run when there is an error (username exists)
    const onError = (error) => {
        res.status(409).json({
            message: error.message
        })
    }

    // check username duplication
    User.findOneByUserName(username)
    .then(create)
    .then(count)
    .then(assign)
    .then(respond)
    .catch(onError)
}



/*
    POST /api/auth/register
    {
        username,
        password,
        email
    }
*/

exports.login = (req, res) => {
    const {username, password} = req.body
    const secret = req.app.get('jwt-secret')

    // check the user info & generate the jwt
    const check = (user) => {
        if(!user) {
            // user does not exist
            throw new Error('login failed')
        } else {
            // user exists, check the password
            if(user.verify(password)) {
                // create a promise that generates jwt asynchronously
                const p = new Promise((resolve, reject) => {
                    jwt.sign(
                        {
                            _id: user._id,
                            username: user.username,
                            admin: user.admin
                        },
                        secret,
                        {
                            expiresIn: '1h',
                            subject: 'userInfo'
                        }, (err, token) => {
                            if (err) reject (err)
                            resolve(token)
                        })
                })
                return p
            } else {
                throw new Error('login failed')
            }
        }
    }

    // respond the token
    const respond = (token) => {
        res.json({
            message: 'logged in successfully',
            token
        })
    }

    // error occured
    const onError = (error) => {
        res.status(403).json({
            message: error.message
        })
    }

    // find the user
    User.findOneByUserName(username)
    .then(check)
    .then(respond)
    .catch(onError)
}


/*
    GET /api/auth/check
*/

exports.check = (req, res) => {
    res.json({
        success: true,
        info: req.decoded
    })
}

/**
 *  PUT /api/auth/update
 */

exports.update = (req, res) => {
    const {_id} = req.decoded
    User.update(
        {_id: _id}, 
        { $set: req.body },
        (err, output) => {
            if(err) res.status(500).json({ error: 'database failure' })
            if(!output.n) return res.status(404).json({ error: 'user not found'})
            res.json({ message: 'user updated'})
        }
    )
}
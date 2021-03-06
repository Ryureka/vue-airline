const User = require('../../../models/user')
const GuideService = require('../../../models/guideservice')
const ObjectID = require('mongodb').ObjectID;
const PaymentStore = require('../../../models/paymentStore')
const Option = require('../../../models/option')
/*
    GET /api/user/list
*/

exports.list = (req, res) => {
    // refuse if not an admin
    if(!req.decoded.admin) {
        return res.status(403).json({
            message: 'you are not an admin'
        })
    }

    User.find({})
    .then( users => {
        res.json({users})
    })
    .catch( err=> {
        res.json({error: err})
    })
}
exports.getByUserId = (req, res) => {
    const {userid} = req.params
    User.findById(userid)
    .select('_id email nickname profileImageUrl')
    .then( user => {
        res.status(200).json({user, success:true})
    })
    .catch( err => {
        console.log(err)
        res.status(400).json({success:false, msg:'없는 유저입니다.'})
    })
}
// exports.assignAdmin = (req, res) => {
//     // refuse if not an admin
//     if(!req.decoded.admin) {
//         return res.status(403).json({
//             message: 'you are not an admin'
//         })
//     }

//     User.findOneByUserName(req.params.username)
//     .then(
//         user => user.assignAdmin()
//     ).then(
//         res.json({
//             success: true
//         })
//     )
// }

exports.userDelete = (req, res) => {
    if(!req.decoded.admin) {
        return res.status(403).json({
            message: 'yue are not an admin'
        })
    }

    User.remove({ username: req.params.username}, function(err, output) {
        if(err) return res.status(500).json({ error: 'database failure'})

        res.status(204).end()
    })
}

// 유저가 권한을 갖고 마음대로 수정할 위험이 있어서 수정해야함.
// ex) 헤더에 토큰을 넣고 put요청으로 자신의 usedguide를 수정할 수 있음.
exports.update = (req, res) => {
    const {_id } = req.decoded

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

exports.mypage = (req, res) => {
    const {_id} = req.decoded
    User.findById(_id)
    .select('-password')
    .populate({ path: 'UsedGuideServices', populate: {path: 'user'}, model: GuideService})
    .then( userInfo => {
        PaymentStore.find()
        .where('user').equals(userInfo._id)
        .lean()
        .then( paymentRecords => {
            const optionsTmp = []
            for (rc of paymentRecords) {
                optionsTmp.push(rc.service.options)
            }
            Promise.all(optionsTmp.map( async (op) => {
                return await Option.find({_id: {$in: op}})
            }))
            .then(values => {
            
                console.log(values)
                res.status(200).json({userInfo, paymentRecords, options: values})
            })
        })
        .catch( err => {
            console.log(err)
            res.status(500).json({error: err})
        })
    })
    .catch( err => {
        console.log(err)
        res.status(500).json({error: err})
    })
}

exports.addUsedGuideServices = (req, res) => {
    const {_id, username, admin} = req.decoded
    if( !admin && username !== req.params.username ) return res.status(403).json({ error: 'permission denied!!!'})

    User.findOne({_id:_id},(err,user)=>{
        if(err) res.status(404).json({err})
        if(user){
            const service = user.UsedGuideServices.filter( service => {
               return service == req.params.guideServiceId
            })
            if (service.length !== 0 )  return  res.status(409).json({ error: 'exist aleady!'})
            GuideService.findOne({_id:req.params.guideServiceId},(err,guideservice)=>{
                user.UsedGuideServices.push(guideservice)
                user.save()
                res.json({message:'success save!!'})
            })
        }
    })
}

exports.removeUsedGuideServices = (req, res) => {
    const {_id, username, admin} = req.decoded
    if( !admin && username !== req.params.username ) return res.status(403).json({ error: 'permission denied!!!'})

    User.findById(_id)
    .then( async (user) => {
        const deleted = await user.UsedGuideServices.filter( service => {
            return service !== null && service.toString() !== req.params.guideServiceId
        })
        user.UsedGuideServices = deleted
        await user.save()
        res.json({'message': 'deleted!!'})
    })
}

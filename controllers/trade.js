const Trade = require('../models/trades')
const authenticate = require('../common/auth_middleware') //this virable we will put 
const User = require('../models/users')

// in the routes that we want to protect for example:
// router.post(
//   "",
//   checkAuth, *** add it as a extra argument >> and now only if authenticated this routes will work
//   multer({ storage: storage }).single("image") 
// 

const sendError = (res, code, message) => {
  return res.status(code).send({
    'status': 'failed',
    'error': message
  })
}

const add = (req, res, next) => {
  const contract = new Trade({
    description: req.body.description,
    depositSeller: req.body.depositSeller,
    depositBuyer: req.body.depositBuyer,
    walletAddressSeller: req.body.walletAddressSeller,
    walletAddressBuyer: req.body.walletAddressBuyer,
    date: req.body.date,
    email: req.body.email,
    creator: req.userData.userId,
    status: req.body.status,
    buyerID: req.body.buyerID,
  });
  const {
    email
  } = req.body
  const user = User.findOne({
    email: contract.email
  }).then(user => {
    if (user) {
      console.log(user);
      contract.buyerID = user._id
      console.log(contract.buyerID);
      contract.save().then((result) => {
        res.status(201).json({
          message: 'contract was sent to other user.',
          contractId: result.id,
        });
      })
    } else {
      return res.status(401).json({
        message: "User does not exist."
      })
    }
  }, err => {
    return res.status(401).send({
      'status': 'failed',
      'error': 'failed to sent contract'
    })
  })
}

const getContract = async (req, res) => {
  //Trade.find({$or:[{sellerid:req.user},{buyerid:req.user}]).then(documents => {
  console.log("getContract")
  Trade.find().then(documents => {
    res.status(200).json({
      message: 'posts fetched successfully',
      contracts: documents
    });
  });
}

const getContractByUserId = async (req, res) => {
  const cretorId = req.userData.userId
  Trade.find({
    creator: cretorId
  }).then(documents => {
    console.log(documents)
    res.status(200).json({
      message: 'posts fetched successfully',
      contracts: documents
    });
  });
}

const editContract = (req, res, next) => {
  const contract = new Trade({
    _id: req.body.id,
    description: req.body.description,
    depositSeller: req.body.depositSeller,
    depositBuyer: req.body.depositBuyer,
    walletAddressSeller: req.body.walletAddressSeller,
    walletAddressBuyer: req.body.walletAddressBuyer,
    date: req.body.date,
    creator: req.userData.userId
  });
  Trade.updateOne({
      _id: req.params.id,
      creator: req.userData.userId
    }, contract)
    .then(result => {
      if (result.nModified > 0) {
        res.status(200).json({
          message: "Contract updated succesfully."
        })
      } else {
        res.status(401).json({
          message: "Not authorization!"
        })
      }
    })
}

const cancelContract = (req, res, next) => {
  Trade.deleteOne({
    _id: req.params.id,
    creator: req.userData.userId
  }).then(result => {
    if (result.n > 0) {
      res.status(200).json({
        message: "Delete succesfully."
      })
    } else {
      res.status(401).json({
        message: "Delete not authorization!"
      })
    }
  })
}

module.exports = {
  add,
  getContract,
  getContractByUserId,
  editContract,
  cancelContract
}
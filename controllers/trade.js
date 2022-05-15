const Trade = require('../models/trades')
const authenticate = require('../common/auth_middleware') //this virable we will put 
const User = require('../models/users')

const sendError = (res, code, message) => {
  return res.status(code).send({
    'status': 'failed',
    'error': message
  })
}
//---------------------- Add new contracts //----------------------

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

//---------------------- Get all contracts //----------------------

const getContract = async (req, res) => {
  console.log("getContract")
  Trade.find().then(documents => {
    res.status(200).json({
      message: 'contracts fetched successfully',
      contracts: documents
    });
  });
}

//---------------------- New contracts //----------------------

const getNewContractByUserId = async (req, res) => {
  const creatorId = req.userData.userId
  Trade.find({
    $or: [{
      creator: creatorId
    }]
  }).then(documents => {
    console.log(creatorId);
    console.log(documents[0].buyerID);
    if (documents[0].buyerID != creatorId) { // buyer id and seller id
      res.status(200).json({
        message: 'contracts fetched successfully and send to both side',
        contracts: documents
      });
    }
  }, err => {
    res.status(401).json({
      message: 'falid to fetch contract!',
    });
  });
}
//---------------------- History contracts //----------------------

const getHistoryByUserId = async (req, res) => {
  const creatorId = req.userData.userId
  Trade.find({
    $or: [{
      creator: creatorId
    }]
  }).then(
    documents => {
      console.log(creatorId);
      console.log(documents[0].buyerID);
      if (documents[0].buyerID != creatorId) { // buyer id and seller id
        res.status(200).json({
          message: 'contracts fetched successfully and send to both side',
          contracts: documents
        });
      }
    }, err => {
      res.status(401).json({
        message: 'falid to fetch contract!',
      });
    });
}

//---------------------- Edit contracts //----------------------

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

//---------------------- Cancel contracts //----------------------

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
  getNewContractByUserId,
  getHistoryByUserId,
  editContract,
  cancelContract,
}
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
    status: "Waiting",
    tradeAddress: req.body.tradeAddress,
    buyerPay: req.body.buyerPay,
    sellerPay: req.body.sellerPay
  });
  const {
    email
  } = req.body
  const user = User.findOne({
    email: contract.email
  }).then(user => {
    if (user) {
      contract.buyerID = user._id
      contract.save().then((result) => {
        res.status(201).json({
          message: 'contract was sent to other user.',
          contractId: result.id,
          buyerId: user._id
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
  const creatorId = req.userData.userId

  const trade = await Trade.find({
    $or: [{
      creator: creatorId
    }, {
      buyerID: creatorId
    }]
  }).then(documents => {
    res.status(200).json({
      message: 'contracts fetched successfully',
      contracts: documents
    });
  });
}

//---------------------- New contracts //----------------------

const getNewContractByUserId = async (req, res, next) => {
  const creatorId = req.userData.userId
  
  Trade.find({
    $and: [{
        $or: [{
            creator: creatorId
          },
          {
            buyerID: creatorId
          },
        ]
      },
      {
        status: "Waiting",
      }
    ]
  }).then(documents => {
    res.status(200).json({
      message: 'New transction has been made successfully',
      contracts: documents
    });
  }, err => {
    res.status(401).json({
      message: 'falid to fetch contract!',
    });
  });
}
//---------------------- History contracts //----------------------

const getHistoryByUserId = async (req, res, next) => {
  const creatorId = req.userData.userId
  Trade.find({
    $and: [{
        $or: [{
            creator: creatorId
          },
          {
            buyerID: creatorId
          },
        ]
      },
      {
        status: "Close",
      }
    ]
  }).then(
    documents => {
      res.status(200).json({
        message: 'Transction transferred to History',
        contracts: documents
      });

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

//---------------------- History contracts by email //----------------------

const getHistoryByEmail = async (req, res) => {
  const creatorId = req.userData.userId

  const user = await User.findOne({
    email: req.body.partner
  }).then(user => {
    if (user) {
       return user;
    }
  }, err => {
    res.status(401).json({
      message: 'falid to fetch contract!',
    });
  });


  Trade.find({
    status: "Close",
    $or: [{
      creator: user.id.valueOf()
    }, {
      buyerID: user.id.valueOf()
    }]
  }).then(
    documents => {
      res.status(200).json({
        message: 'contracts fetched successfully and send to both side',
        contracts: documents
      });

    }, err => {
      res.status(401).json({
        message: 'falid to fetch contract!',
      });
    });
}


//---------------------- New contracts by email //----------------------

const getNewContractByEmail = async (req, res) => {
  const creatorId = req.userData.userId

  const user = await User.findOne({
    email: req.body.partner
  }).then(user => {
    if (user) {
       return user;
    }
  }, err => {
    res.status(401).json({
      message: 'falid to fetch contract!',
    });
  });

  Trade.find({
    status: "Waiting",
    $or: [{
      creator: user.id.valueOf()
    }, {
      buyerID: user.id.valueOf()
    }]
  }).then(
    documents => {
      res.status(200).json({
        message: 'contracts fetched successfully and send to both side',
        contracts: documents
      });

    }, err => {
      res.status(401).json({
        message: 'falid to fetch contract!',
      });
    });
}



module.exports = {
  add,
  getContract,
  getNewContractByUserId,
  getHistoryByUserId,
  editContract,
  cancelContract,
  getHistoryByEmail,
  getNewContractByEmail
}
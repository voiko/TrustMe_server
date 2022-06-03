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
    emailBuyer: req.body.emailBuyer,
    emailSeller: req.userData.email,
    creator: req.userData.userId,
    status: req.body.status,
    buyerID: req.body.buyerID,
    status: "Waiting",
    tradeAddress: req.body.tradeAddress,
    buyerPay: req.body.buyerPay,
    sellerPay: req.body.sellerPay,
    escrowId: "1", // default
  });
  const {
    email
  } = req.body
  const user = User.findOne({
    email: contract.emailBuyer
  }).then(user => {
    if (user) {
      contract.buyerID = user._id
      contract.save().then((result) => {
        res.status(201).json({
          message: 'contract was sent to other user.',
          contractId: result.id,
          buyerId: user._id,
          emailSeller: contract.emailSeller
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
        status: "Closed",
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
//---------------------- Updtae Status //----------------------
const updateContract = async (req, res, next) => {
  Trade.updateOne({
    _id: req.body.id
  }, {
    $set: {
      status: "Created"
    }
  }).then(data => {
    res.status(200).json({
      message: "Status has been changed!"
    })
  }, err => {
    res.status(401).json({
      message: 'Falid to updated status',
    });
  })
}

//---------------------- Update Seller Pay //----------------------

const updateSellerPay = async (req, res, next) => {
  Trade.updateOne({
    _id: req.body.id
  }, {
    $set: {
      sellerPay: true
    }
  }).then(data => {
    res.status(200).json({
      message: "Update Seller Pay",
      seller: data
    })
  }, err => {
    res.status(401).json({
      message: 'Falid to Update Seller Pay',
    });
  })
}
//---------------------- Update Buyer Pay //----------------------

const updateBuyerPay = async (req, res, next) => {
  Trade.updateOne({
    _id: req.body.id
  }, {
    $set: {
      buyerPay: true
    }
  }).then(data => {
    res.status(200).json({
      message: "Update Buyer Pay",
      buyer: data
    })
  }, err => {
    res.status(401).json({
      message: 'Falid to Update Buyer Pay',
    });
  })
}

module.exports = {
  add,
  getContract,
  getNewContractByUserId,
  getHistoryByUserId,
  editContract,
  cancelContract,
  getHistoryByEmail,
  getNewContractByEmail,
  updateContract,
  updateSellerPay,
  updateBuyerPay
}
const Trade = require('../models/trades')
const authenticate = require('../common/auth_middleware') //this virable we will put 
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
        side: req.body.side,
        description: req.body.description,
        deposit: req.body.deposit,
        emailOfAnotherSide: req.body.emailOfAnotherSide,
        date: req.body.date
      });
      contract.save().then((result)=>{
        res.status(201).json({
          message : 'contract added successfully',
          contractId : result.id
        });
      })
    
      console.log(contract);
}

const getContract = async (req, res) => {
    console.log("get contract1")
    Trade.find().then(documents =>{
        res.status(200).json({
          message : 'posts fetched successfully',
          contracts: documents
        });
    });
}

module.exports = {
    add,
    getContract
}
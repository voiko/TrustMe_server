const Trade = require("../models/trades");
const authenticate = require("../common/auth_middleware"); //this virable we will put
const User = require("../models/users");
const Recommendation = require("../models/recommendation");

const sendError = (res, code, message) => {
  return res.status(code).send({
    status: "failed",
    error: message,
  });
};

//---------------------- Add new recommendation //----------------------

const add = (req, res, next) => {
  const message = new Recommendation({
    messageFrom: req.body.messageFrom,
    messageTo: req.body.messageTo,
    content: req.body.content,
    senderName: req.body.senderName
  });
  console.log(message);
  message.save().then(() => {
    res.status(201).json({
      message: "recommendation was sent",
    });
  }),
    (err) => {
      return res.status(401).send({
        status: "failed",
        error: "failed to add recommendation",
      });
    }
}

//---------------------- History contracts by email //----------------------

const getRecommendationByEmail = async (req, res) => {
    Recommendation.find({
     messageTo: req.body.email
    }).then(
      documents => {
        console.log(documents)
        res.status(200).json({
          message: 'recommendations fetched successfully and send to both side',
          recommendations: documents
        });
    }, err => {
        res.status(401).json({
          message: 'falid to fetch recommendations!',
        });
      });
  }


//---------------------- exports //-------------------------------------
module.exports = {
    add,
    getRecommendationByEmail
};

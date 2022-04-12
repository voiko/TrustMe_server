const Trade = require('../models/trade')
const authenticate = require('../common/auth_middleware') //this virable we will put 
// in the routes that we want to protect for example:
// router.post(
//   "",
//   checkAuth, *** add it as a extra argument >> and now only if authenticated this routes will work
//   multer({ storage: storage }).single("image") 
// 
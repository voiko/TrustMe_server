$(function () {
  $(window).load(function () {
    App.init();
  });
});
var trade_index = 0;
App = {

  params: null,
  web3Provider: null,
  contracts: {},

  init: async function () {
    console.log(token);
   


    return await App.initWeb3();
  },

  initWeb3: async function () {

    // Modern dapp browsers...
    if (window.ethereum) {
      App.web3Provider = window.ethereum;
      try {
        // Request account access
        await window.ethereum.request({
          method: "eth_requestAccounts"
        });
      } catch (error) {
        // User denied account access...
        console.error("User denied account access")
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      App.web3Provider = window.web3.currentProvider;
    }
    // If no injected web3 instance is detected, fall back to Ganache
    else {
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
    }
    web3 = new Web3(App.web3Provider);

    return App.initContract();
  },

  initContract: function () {

    $.getJSON('/EscrowContract/build/contracts/EscrowManager.json', function (data) {
      // Get the necessary contract artifact file and instantiate it with @truffle/contract
      var EscrowManagerArtifact = data;
      App.contracts.EscrowManager = TruffleContract(EscrowManagerArtifact);

      // Set the provider for our contract
      App.contracts.EscrowManager.setProvider(App.web3Provider);
    });

    return App.bindEvents();
  },

  bindEvents: function () {

    $(document).on('click', '.btn-createTrade', App.creat_Trade);
    $(document).on('click', '.btn-getTradeById', App.get_TradeById);
    $(document).on('click', '.btn-setAgreement', App.set_Agreement);
  },

  creat_Trade: function (event) {
    event.preventDefault();


    var expired_time = convetDateToTimStamp(date);


    var EscrowManagerInstance;

    web3.eth.getAccounts(function (error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      App.contracts.EscrowManager.deployed().then(function (instance) {
        EscrowManagerInstance = instance;

        return EscrowManagerInstance.createTrade(walletAddressSeller, walletAddressBuyer,
          depositSeller, depositBuyer, expired_time, {
            from: account
          });
      }).then(async function (result) {
        console.log(result.logs[0].args);
        console.log(result.logs[0].args._tradeAddress);
        console.log(result.logs[0].args._tradeIndex['c'][0]);

        //----Post trade details to backend----------------
        await postTransaction(result.logs[0].args._tradeAddress, result.logs[0].args._tradeIndex['c'][0]);
        //-------------------------------------------------


        return App.bindEvents();
      }).catch(function (err) {
        console.log(err.message);
      });
    });
  },

  get_TradeById: function (event) {
    event.preventDefault();


    escrowId = 64;

    web3.eth.getAccounts(function (error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      App.contracts.EscrowManager.deployed().then(function (instance) {
        EscrowManagerInstance = instance;
        console.log(EscrowManagerInstance);

        return EscrowManagerInstance.getTradeById(escrowId, {
          from: account
        });
      }).then(async function (result) {
        console.log(result.logs[0])
        var sellerPay = result.logs[0].args._sellerPaid;
        var buyerPay = result.logs[0].args._buyerPaid;

        console.log(sellerPay)
        console.log(buyerPay)

        await UpdateStatusByEscrowId(escrowId, buyerPay, sellerPay);

        return App.bindEvents();
      }).catch(function (err) {
        console.log(err.message);
      });

    });
    // window.location.replace('http://localhost:4200/')
  },

  set_Agreement: function (event) {
    event.preventDefault();

    escrowId = 64;

    var contractId = $('#contractId_getAgreement').val();

    var EscrowManagerInstance;

    web3.eth.getAccounts(async function (error, accounts) {
      if (error) {
        console.log(error);
      }
      //----just for debuging----------
      var buyerPay = true;
      var sellerPay = true;
      await UpdateStatusByEscrowId(escrowId, buyerPay, sellerPay);
      //--------------------------------     
      var account = accounts[0];

      App.contracts.EscrowManager.deployed().then(function (instance) {
        EscrowManagerInstance = instance;

        return EscrowManagerInstance.setAgreement(escrowId, {
          from: account
        });
      }).then(function (result) {

        //TODO chage to this after the testing 
        // var buyerPay = true;
        // var sellerPay = true;

        // await UpdateStatusByEscrowId(escrowId , buyerPay , sellerPay);
        alert("Deal is done, The money is back")
        return App.bindEvents();
      }).catch(function (err) {
        console.log(err.message);
      });
    });
  },

};

function searchToObject() {
  var pairs = window.location.search.substring(1).split("&"),
    obj = {},
    pair,
    i;

  for (i in pairs) {
    if (pairs[i] === "") continue;

    pair = pairs[i].split("=");
    obj[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
  }

  return obj;
}

function convetDateToTimStamp(date) {
  var date = date.split("/");
  var newDate = new Date(date[2], date[1] - 1, date[0]);
  return newDate.getTime();
}

async function postTransaction(tradeAddress, escrowId) {
  var status = 'Waiting';
  var creator = '';
  console.log(tradeAddress)
  console.log(escrowId)
  var buyerID = ''
  var buyerPay = false;
  var sellerPay = false;


  const result = await fetch('http://localhost:3000/api/contracts/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      authorization: token
    },
    body: JSON.stringify({
      description,
      depositSeller,
      depositBuyer,
      walletAddressSeller,
      walletAddressBuyer,
      date,
      emailBuyer,
      creator,
      status,
      buyerID,
      buyerPay,
      sellerPay,
      tradeAddress,
      escrowId
    })
  }).then((res) => res.json())
  if (result.error) {
    alert(result.error);
  } else if (result.status == 'ok') {
    alert(result.contractId);
  }
  // trade_index = result.contractId
  // console.log(trade_index)


}

async function UpdateStatusByEscrowId(escrowId, buyerPay, sellerPay) {
  var status = 'Active';
  var id = "629b0728af0e7c6b6ca72c31";
  //TODO to replace _id to escrowId 
  console.log("in the func");

  const result = await fetch('http://localhost:3000/api/contracts/updateContract', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      authorization: token
    },
    body: JSON.stringify({
      id, //TODO to replace _id to escrowId 
      status,
      sellerPay,
      buyerPay
    })
  }).then((res) => res.json())
  if (result.error) {
    alert(result.error);
  } else if (result.status == 'ok') {
    alert(result.contractId);
  }
  console.log(result);
}
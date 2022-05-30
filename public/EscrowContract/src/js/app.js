$(function () {
  $(window).load(function () {
    App.init();
  });
});

App = {
  params: null,
  web3Provider: null,
  contracts: {},

  init: async function () {

    console.log(description);
    console.log(depositSeller);
    console.log(depositBuyer);
    console.log(walletAddressSeller);
    console.log(walletAddressBuyer);
    console.log(email);
    console.log(token);
    console.log(date);

    return await App.initWeb3();
  },

  initWeb3: async function () {
    
    // Modern dapp browsers...
    if (window.ethereum) {
      App.web3Provider = window.ethereum;
      try {
        // Request account access
        await window.ethereum.request({ method: "eth_requestAccounts" });
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
    $(document).on('click', '.btn-escrowBalance', App.get_TradeById);
    $(document).on('click', '.btn-setAgreement', App.set_Agreement);
  },

  creat_Trade: function (event) {
    event.preventDefault();
  

    var expired_time = convetDateToTimStamp(date);
    var trade_index = 0;
    var status = "waiting;";

    var EscrowManagerInstance;

    web3.eth.getAccounts(function (error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];
      //----Post trade details to backend-----   test     -----------
      // postTransaction()
      //-------------------------------------------------

      App.contracts.EscrowManager.deployed().then(function (instance) {
        EscrowManagerInstance = instance;

        return EscrowManagerInstance.createTrade(trade_index, walletAddressSeller, walletAddressBuyer,
          depositSeller, depositBuyer, expired_time, { from: account });
      }).then(function (result) {
        console.log(result.logs[0].args);
        return App.bindEvents();
      }).catch(function (err) {
        console.log(err.message);
      });
    });
  },

  get_TradeById: function (event) {
    event.preventDefault();

    var contractId = $('#contractId').val();

    web3.eth.getAccounts(function (error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      App.contracts.EscrowManager.deployed().then(function (instance) {
        EscrowManagerInstance = instance;
        console.log(EscrowManagerInstance);

        return EscrowManagerInstance.getTradeById(contractId, { from: account });
      }).then(function (result) {
        console.log(result.logs[0]);
        return App.bindEvents();
      }).catch(function (err) {
        console.log(err.message);
      });
    });
  },

  set_Agreement: function (event) {
    event.preventDefault();

    var contractId = $('#contractId_getAgreement').val();

    var EscrowManagerInstance;

    web3.eth.getAccounts(function (error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      App.contracts.EscrowManager.deployed().then(function (instance) {
        EscrowManagerInstance = instance;

        return EscrowManagerInstance.setAgreement(contractId, { from: account });
      }).then(function (result) {
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

async function postTransaction() {
  var description = App.params.description;
  var depositSeller = App.params.depositSeller;
  var depositBuyer = App.params.depositBuyer;
  var walletAddressSeller = App.params.walletAddressSeller;
  var walletAddressBuyer = App.params.walletAddressBuyer;
  var date = App.params.date;
  var email = App.params.email;
  var creator = "626ed80d799270f5d99bbd05"
  var buyerID = "null"
  console.log("in the function - " + description + "-" + depositSeller + "-" + email + "-" + date);
  var status = "waiting;";

  const result = await fetch('http://localhost:3000/api/contracts/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      authorization: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Imltb3JrcmF2aXR6QGdtYWlsLmNvbSIsInVzZXJJZCI6IjYyNmVkODBkNzk5MjcwZjVkOTliYmQwNSIsImlhdCI6MTY1MzQ5NzA0MiwiZXhwIjoxNjUzNDk3OTQyfQ.vImRRffRvu9vypHAK71vDEYIRWvvevClOoj0XWLYOY4'
    },
    body: JSON.stringify({
      description,
      depositSeller,
      depositBuyer,
      walletAddressSeller,
      walletAddressBuyer,
      date,
      email,
      creator,
      status,
      buyerID
    })
  }).then((res) => res.json())
  if (result.error) {
    alert(result.error);
  } else if (result.status == 'ok') {
    alert("succses!")
  }


  async function insert(event) {

    // event.preventDefault()
    var description = App.params.description;
    var depositSeller = App.params.depositSeller;
    var depositBuyer = App.params.depositBuyer;
    var walletAddressSeller = App.params.walletAddressSeller;
    var walletAddressBuyer = App.params.walletAddressBuyer;
    var date = App.params.date;
    var email = App.params.email;
    var creator = "626ed80d799270f5d99bbd05"
    var buyerID = "null"
    var authorization = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Imltb3JrcmF2aXR6QGdtYWlsLmNvbSIsInVzZXJJZCI6IjYyNmVkODBkNzk5MjcwZjVkOTliYmQwNSIsImlhdCI6MTY1MzQ5NTk0NSwiZXhwIjoxNjUzNDk2ODQ1fQ.tkttyMn0Kwpi_n8Wg_C1ip62VswZ9cvU1WdsmTr6XRw"

    // const name = document.getElementById('name').value
    // const texts = document.getElementById('Textarea').value
    // const images = document.getElementById('images').value

    const result = await fetch('http://localhost:3000/api/contracts/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        description,
        depositSeller,
        depositBuyer,
        walletAddressSeller,
        walletAddressBuyer,
        date,
        email,
        creator,
        buyerID,
        authorization
      })
    }).then((res) => res.json())
    if (result.error) {
      alert(result.error);
    } else if (result.status == 'ok') {
      alert('An advertisement was placed on the site');
      window.location.replace('/admin.html')
    }
  }

}



$(function () {
  $(window).load(function () {
    App.init();
  });
});

App = {
  web3Provider: null,
  contracts: {},

  init: async function () {
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
    const DeployBtn = document.querySelector('#submitBtn');
    const isChecked = document.querySelector('#flexCheckChecked');
    isChecked.addEventListener('change', function (e) {
      if (isChecked.checked) {
        DeployBtn.disabled = false;
      } else {
        DeployBtn.disabled = true;
      }
    });

    $(document).on('click', '.btn-delete', App.Delete);
    $(document).on('click', '.btn-createTrade', App.creat_Trade);
    $(document).on('click', '.btn-getTradeById', App.get_TradeById);
    $(document).on('click', '.btn-setAgreement', App.set_Agreement);
  },

  creat_Trade: function (event) {
    $('#spinner').show();
    const DeployBtn = document.querySelector('#submitBtn');
    DeployBtn.disabled = true;
    const DeletBtn = document.querySelector('#submitBtnn');
    DeletBtn.disabled = true;
    event.preventDefault();

    //convert ether to wei
    var depositSellerWei = depositSeller * 1000000000000000000;
    var depositBuyerWei = depositBuyer * 1000000000000000000;

    var expired_time = convetDateToTimStamp(date);

    var EscrowManagerInstance;

    web3.eth.getAccounts(function (error, accounts) {
      if (error) {
        console.log(error);
      }
      var account = accounts[0];

      App.contracts.EscrowManager.deployed().then(function (instance) {
        EscrowManagerInstance = instance;
        // await weiToEther(depositSeller);
        // await weiToEther(depositBuyer);
        console.log(depositSellerWei)

        return EscrowManagerInstance.createTrade(walletAddressSeller, walletAddressBuyer,
          depositSellerWei, depositBuyerWei, expired_time, {
            from: account
          });
      }).then(async function (result) {
        console.log(result.logs[0].args);
        //====Post trade details to backend===============================================================
        await postTransaction(result.logs[0].args._tradeAddress, result.logs[0].args._tradeIndex['c'][0]);
        //================================================================================================
        window.location.replace('http://localhost:4200/')
        return App.bindEvents();
      }).catch(function (err) {
        console.log(err.message);
        alert("Something went wrong.\ntry again later")
        window.location.replace('http://localhost:4200/')
      });
    });
  },

  get_TradeById: function (event) {
    $('#spinner').show();
    const CheckBtn = document.querySelector('#submitBtn1');
    CheckBtn.disabled = true;
    event.preventDefault();

    web3.eth.getAccounts(function (error, accounts) {
      if (error) {
        console.log(error);
      }
      var account = accounts[0];

      App.contracts.EscrowManager.deployed().then(function (instance) {
        EscrowManagerInstance = instance;
        console.log(escrowId);

        return EscrowManagerInstance.getTradeById(escrowId, {
          from: account
        });
      }).then(async function (result) {
        console.log(result.logs[0])
        var sellerPay = result.logs[0].args._sellerPaid;
        var buyerPay = result.logs[0].args._buyerPaid;
        console.log("**************************")
        console.log(result.logs[0].args._step['c'][0])
        var status;
        switch (result.logs[0].args._step['c'][0]) {
          case 0:
            status = 'Created';
            break;

          case 1:
            status = 'Active';
            break;

          case 2:
            status = 'Closed';
            break;

          case 3:
            status = 'Closed'
            break;
          default:
        }
        console.log(sellerPay)
        console.log(buyerPay)
        console.log(status)
        //====Post trade details to backend==================================
        await UpdateStatusByEscrowId(escrowId, buyerPay, sellerPay, status);
        //===================================================================
        window.location.replace('http://localhost:4200/')
        return App.bindEvents();
      }).catch(function (err) {
        console.log(err.message);
        alert("Something went wrong.\ntry again later")
        window.location.replace('http://localhost:4200/')
      });
    });
  },

  set_Agreement: function (event) {
    $('#spinner').show();
    const CheckBtn = document.querySelector('#submitBtn1');
    CheckBtn.disabled = true;
    event.preventDefault();

    var EscrowManagerInstance;

    web3.eth.getAccounts(function (error, accounts) {
      if (error) {
        console.log(error);
      }
      var account = accounts[0];

      App.contracts.EscrowManager.deployed().then(function (instance) {
        EscrowManagerInstance = instance;

        return EscrowManagerInstance.setAgreement(escrowId, {
          from: account
        });
      }).then(async function (result) {
        console.log(result.logs[0])
        var sellerPay = result.logs[0].args._sellerPaid;
        var buyerPay = result.logs[0].args._buyerPaid;
        var status;
        switch (result.logs[0].args._step['c'][0]) {
          case 0:
            status = 'Created';
            break;

          case 1:
            status = 'Active';
            break;

          case 2:
            status = 'Closed';
            break;

          case 3:
            status = 'Closed'
            break;
          default:
        }
        console.log(sellerPay)
        console.log(buyerPay)
        console.log("Trade status: " + status)
        //====Post trade details to backend==================================
        await UpdateStatusByEscrowId(escrowId, buyerPay, sellerPay, status);
        //===================================================================
        if (status == 'Closed') {
          alert("The Trade is done, The money is back")
          window.location.replace('http://localhost:4200/')
        } else {
          alert("Something went wrong.\n Check that the contract has not expired, And try again later")
          window.location.replace('http://localhost:4200/')
        }
        return App.bindEvents();
      }).catch(function (err) {
        console.log(err.message);
        window.location.replace('http://localhost:4200/')
      });
    });
  },
  Delete: function(event){
    event.preventDefault();
    window.location.replace('http://localhost:4200/')
  }
};

function convetDateToTimStamp(date) {
  var date = date.split("/");
  var newDate = new Date(date[2], date[1] - 1, date[0]);
  return newDate.getTime();
}

async function postTransaction(tradeAddress, escrowId) {
  var status = 'Waiting';
  var creator = '';
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
  console.log(result);
}

async function UpdateStatusByEscrowId(escrowId, buyerPay, sellerPay, status) {
  const result = await fetch('http://localhost:3000/api/contracts/updateContract', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      authorization: token
    },
    body: JSON.stringify({
      escrowId,
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


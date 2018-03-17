const web3 = global.web3;
let isCheckInstall = false;
let isCheckLogin = false;
let cbs = {
  checkInstall: [],
  checkLogin: []
}

export default {
  getTxParams,
  viewAddressPath: 'https://rinkeby.etherscan.io/address',
  viewTxPath: 'https://rinkeby.etherscan.io/tx',
  onCheckInstall,
  onCheckLogin,
  checkMetamask,
  metamaskInstalled,
  metamaskLogin
}

function onCheckInstall(cb) {
  if (isCheckInstall) {
    return cb();
  }
  cbs.checkInstall.push(cb);
}

function onCheckLogin(cb) {
  if (isCheckLogin) {
    return cb();
  }
  cbs.checkLogin.push(cb);
}

function checkMetamask(retry) {
  setTimeout(checkInstall, 0, retry);
  setTimeout(checkLogin, 0, retry);

  function checkInstall(retry) {
    retry--

    if (retry && !metamaskInstalled()) {
      return setTimeout(checkInstall, 500, retry);
    }
    checkInstall = true;
    cbs.checkInstall.forEach(cb => setTimeout(cb));
    cbs.checkInstall = [];
  }

  function checkLogin(retry) {
    retry--

    if (retry && !metamaskLogin()) {
      return setTimeout(checkLogin, 500, retry);
    }
    checkLogin = true;
    cbs.checkLogin.forEach(cb => setTimeout(cb));
    cbs.checkLogin = [];
  }
}

function metamaskInstalled() {
  // The line below temporary because it's not the right way to use MetaMask.
  // (The right way to use MetaMask: https://github.com/MetaMask/faq/blob/master/detecting_metamask.md#web3-deprecation)
  if (web3 && web3.currentProvider.isMetaMask) {
    return true;
  }
  return false;
}

function metamaskLogin() {
  if (metamaskInstalled() && web3.eth.defaultAccount) {
    return true;
  }
  return false;
}

function getTxParams(publicKey, to, value, data, gasPrice, web3, cb) {
  web3.eth.getTransactionCount(publicKey, (err, data) => {
    if (err) throw err;

    const params = {
      from: publicKey,
      nonce: web3.toHex(data),
      gasPrice: web3.toHex(gasPrice),
      to,
      value: web3.toHex(value),
      data, //: web3.toHex(data),
      // EIP 155 chainId - mainnet: 1, ropsten: 3
      chainId: 4
    };

    return cb(null, params);
  });
}

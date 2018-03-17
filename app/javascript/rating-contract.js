export default {
  address: getAddress(),
  ABIJson: getABIJson(),
  byteCode: getByteCode()
}

function getAddress() {
  return '0x114b0a5ceedde532d50cefee8e20a7704bcc2afc'
}

function getABIJson() {
  return '[{"constant":true,"inputs":[{"name":"a","type":"uint256"},{"name":"b","type":"uint256"}],"name":"min","outputs":[{"name":"_min","type":"uint256"}],"payable":false,"stateMutability":"pure","type":"function"},{"constant":true,"inputs":[{"name":"a","type":"uint256"},{"name":"b","type":"uint256"}],"name":"divCeil","outputs":[{"name":"result","type":"uint256"}],"payable":false,"stateMutability":"pure","type":"function"},{"constant":false,"inputs":[{"name":"txHash","type":"string"},{"name":"stars","type":"uint256"},{"name":"review","type":"string"}],"name":"rate","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"ratingIdCounter","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"bytes32"}],"name":"ratings","outputs":[{"name":"id","type":"uint256"},{"name":"stars","type":"uint256"},{"name":"review","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"sender","type":"address"},{"name":"txHash","type":"string"}],"name":"getRating","outputs":[{"name":"id","type":"uint256"},{"name":"stars","type":"uint256"},{"name":"review","type":"string"}],"payable":false,"stateMutability":"view","type":"function"}]'
}

function getByteCode() {
  return '0x6060604052341561000f57600080fd5b6107368061001e6000396000f3006060604052600436106100775763ffffffff7c01000000000000000000000000000000000000000000000000000000006000350416637ae2b5c7811461007c57806382251512146100aa578063aa608183146100c6578063ad59236114610164578063b3cf751614610177578063d5b507f214610233575b600080fd5b341561008757600080fd5b6100986004803590602001356102aa565b60405190815260200160405180910390f35b34156100b557600080fd5b6100986004803590602001356102c4565b34156100d157600080fd5b610162600480803590602001908201803590602001908080601f0160208091040260200160405190810160405281815292919060208401838380828437509496863596909550602090810180820195503586018082019450359250829150601f820181900481020160405190810160405281815292919060208401838380828437509496506102e795505050505050565b005b341561016f57600080fd5b61009861040c565b341561018257600080fd5b6101ad6004803573ffffffffffffffffffffffffffffffffffffffff16906020013560001916610412565b6040518084815260200183815260200180602001828103825283818151815260200191508051906020019080838360005b838110156101f65780820151838201526020016101de565b50505050905090810190601f1680156102235780820380516001836020036101000a031916815260200191505b5094505050505060405180910390f35b341561023e57600080fd5b6101ad600480803573ffffffffffffffffffffffffffffffffffffffff1690602001909190803590602001908201803590602001908080601f0160208091040260200160405190810160405281815292919060208401838380828437509496506104e195505050505050565b6000818311156102bb5750806102be565b50815b92915050565b600081838115156102d157fe5b0490508282820210156102be5760010192915050565b600080846040518082805190602001908083835b60208310151561031a57805182526020928390039291820191016102fb565b6001836020036101000a038019825116818451161790925250505091909101925060409150505180910390209150600160003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600083600019166000191681526020019081526020016000209050600184101580156103b45750600a8411155b15156103bf57600080fd5b6113888351111515156103d157600080fd5b60008054600101808255908201556103ea84600a6102aa565b60018201556002810183805161040492916020019061065d565b505050505050565b60005481565b600160205281600052604060002060205280600052604060002060009150915050806000015490806001015490806002018054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156104d75780601f106104ac576101008083540402835291602001916104d7565b820191906000526020600020905b8154815290600101906020018083116104ba57829003601f168201915b5050505050905083565b6000806104ec6106db565b600080856040518082805190602001908083835b60208310151561051f5780518252602092839003929182019101610500565b6001836020036101000a038019825116818451161790925250505091909101925060409150505180910390209150600160008873ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000836000191660001916815260200190815260200160002090508060000154945080600101549350806002018054600181600116156101000203166002900480601f01602080910402602001604051908101604052809291908181526020018280546001816001161561010002031660029004801561064d5780601f106106225761010080835404028352916020019161064d565b820191906000526020600020905b81548152906001019060200180831161063057829003601f168201915b5050505050925050509250925092565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f1061069e57805160ff19168380011785556106cb565b828001600101855582156106cb579182015b828111156106cb5782518255916020019190600101906106b0565b506106d79291506106ed565b5090565b60206040519081016040526000815290565b61070791905b808211156106d757600081556001016106f3565b905600a165627a7a7230582012f3bb5f43602a8b16672e3a8d84f5ccb0894a31fe498d76ac9666542d0c6e3b0029'
}

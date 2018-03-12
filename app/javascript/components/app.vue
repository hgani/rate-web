<template lang='pug'>
  div
    top-menu(:web3='web3' :node='node')

    .container-fluid.my-3
      .row
        //.col-md-3
          side-menu
        .col-md-12
          router-view
</template>

<script>
export default {
  props: ["web3", "web3Helper"],
  data() {
    return {
      node: {
        network: null
      }
    };
  },
  created: function() {
    const self = this;

    if (!self.web3Helper.metamaskInstalled()) {
      alert("Please install MetaMask");
    }
    if (!self.web3Helper.metamaskLogin()) {
      alert("Please login to MetaMask");
    }

    updateNetwork();
    setInterval(updateNetwork, 1000);

    function updateNetwork() {
      web3.version.getNetwork((err, netId) => {
        switch (netId) {
          case "1":
            self.node.network = "Mainnet";
            break;
          case "2":
            self.node.network = "Morden";
            break;
          case "3":
            self.node.network = "Ropsten";
            break;
          case "4":
            self.node.network = "Rinkeby";
            break;
          case "42":
            self.node.network = "Kovan";
            break;
          default:
            self.node.network = "Unknown";
        }
      });
    }
  }
};
</script>


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

    self.web3Helper.onCheckInstall(() => {
      if (!self.web3Helper.metamaskInstalled()) {
        alert("Please install MetaMask");
      }
    });

    self.web3Helper.onCheckLogin(() => {
      if (!self.web3Helper.metamaskLogin()) {
        alert("Please login to MetaMask");
      }
    });

    setInterval(
      () =>
        self.web3Helper.getNetwork((err, net) => {
          self.node.network = net;
        }),
      1000
    );
  }
};
</script>


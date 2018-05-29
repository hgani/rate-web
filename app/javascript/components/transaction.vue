<template lang='pug'>
  .container
    .col-md-8.offset-md-2
      table.table
        tbody(style="font-size: 0.9rem")
          tr(v-for="(tx, index) in transactions")
            td
              .row
                .col-md-8
                  <component :is="headerComponent" :tx="tx" />

                  .mt-2
                    div(v-if="tx.rating.stars")
                      star-rating(:increment="0.5" :rating="tx.rating.stars" :star-size="20" :show-rating="false" :inline="true" :read-only="true")
                      | {{tx.rating.review}}
                    div(v-else)
                      span(v-if="enableRate(tx)")
                        button.btn.btn-success.btn-sm(v-if="enableRate && !tx.rating.id" @click="setRating(tx.hash)") rate&raquo;
                      span(v-else)
                        | No rating yet
                .col-md-4
                  .text-right
                    div= '{{tx.value / 1e18}} ETH'
                    .text-muted: small {{(new Date(+(tx.timeStamp) * 1000)).toLocaleString()}}
              .mt-4.mb-2
                small
                  = 'Tx: '
                  a(:href="'https://rinkeby.etherscan.io/tx/' + tx.hash")
                    | {{tx.hash && tx.hash.toLowerCase()}}
</template>

<script>
export default {
  props: ["transactions", "headerComponent"],
  methods: {
    setRating(hash) {
      const self = this;
      self.$emit("set-rating", hash);
    },
    enableRate(tx) {
      const self = this;
      return tx.from.toLowerCase() === web3.eth.defaultAccount;
    }
  }
};
</script>

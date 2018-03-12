<template lang='pug'>
  .container
    .col-md-8.offset-md-2
      table.table
        tbody(style="font-size: 0.9rem")
          tr(v-for="(tx, index) in transactions")
            td
              .row
                .col-md-8
                  b
                    = 'To: '
                    router-link(:to="{path: 'transactions', query: {recipient: tx.to}}")
                      | {{tx.to && tx.to.toLowerCase()}}

                  .mt-2
                    div(v-if="tx.rating.stars")
                      .stars
                        i.fa.fa-star(v-for="i in [0, 1, 2, 3, 4]" :class="{choosen: tx.rating.stars > i}")
                      | {{tx.rating.review}}
                    div(v-else)
                      button.btn.btn-success.btn-sm(v-if="enableRate && !tx.rating.id" @click="setRating(tx.hash)") rate&raquo;
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
import async from "async";

export default {
  props: ["transactions-owner", "transactions", "enableRate"],
  methods: {
    setRating(hash) {
      const self = this;

      self.$emit("set-rating", hash);
    }
  }
};
</script>

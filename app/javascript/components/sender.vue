<template lang='pug'>
  table.table
    thead
      tr
        th(style="width: 170px;") #
        th(style="width: 480px;") TxHash
        th(style="width: 295px;") Recipient
        th(style="width: 90px;") Stars
        th Review
        th
    tbody(style="font-size: 0.8rem")
      tr(v-for="(tx, index) in transactions")
        td
          | {{(new Date(+(tx.timeStamp) * 1000)).toLocaleString()}}
        td
          a(:href="'https://rinkeby.etherscan.io/tx/' + tx.hash")
            | {{tx.hash && tx.hash.toLowerCase()}}
        td
          router-link(:to="{path: 'transactions', query: {recipient: tx.to}}")
            | {{tx.to && tx.to.toLowerCase()}}
        td.stars
          i.fa.fa-star(v-for="i in [0, 1, 2, 3, 4]" :class="{choosen: tx.rating.stars > i}")
        td
          | {{tx.rating.review}}
        td
          button.btn(v-if="enableRate && !tx.rating.id" @click="setRating(tx.hash)") Rate
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

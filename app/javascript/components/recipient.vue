<template lang='pug'>
  table.table
    thead
      tr
        th(style="width: 170px;") #
        th(style="width: 480px;") TxHash
        th(style="width: 295px;") Sender
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
          router-link(:to="{path: 'transactions', query: {sender: tx.from}}")
            | {{tx.from && tx.from.toLowerCase()}}
        td.stars
          i.fa.fa-star(v-for="i in [0, 1, 2, 3, 4]" :class="{choosen: tx.rating.stars > i}")
        td
          | {{tx.rating.review}}
</template>

<script>
import async from "async";

export default {
  props: ["transactions-owner", "transactions"]
};
</script>

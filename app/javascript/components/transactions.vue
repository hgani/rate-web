<template lang='pug'>
  div.container-fluid
    rate-modal(:web3-helper='web3Helper' :contract='contract' :transaction='tx', @cancel='modalCancel')

    p <strong>Profile</strong>: {{transactionsOwner.toLowerCase()}}
    div(v-if="!isSender")
      div.stars(v-show="avg.completed")
        //| Total rated transactions: <strong>{{avg.count}}</strong>
        //br
        //| Average rating (last 50 rated transactions): <strong>{{avg.result}}</strong>
        //br
        strong Average Rating: &nbsp;
        i.fa.fa-star(v-for="i in [0, 1, 2, 3, 4]" :class="{choosen: avg.result > i}")
      div(v-show="!avg.completed")
        | Calculating...

    ul.nav.nav-tabs.justify-content-center
      li.nav-item
        router-link.nav-link(:to="{path: 'transactions', query: {recipient: isMe ? 'me' : transactionsOwner}}" :class="{active: !isSender}") Received
      li.nav-item
        router-link.nav-link(:to="{path: 'transactions', query: {sender: isMe ? 'me' : transactionsOwner}}" :class="{active: isSender}") Sent

    .tab-content
      pagination(:pagination="pagination")

      sender(
        v-if='isSender'
        :transactionsOwner='transactionsOwner'
        :transactions='transactions'
        :enableRate='enableRate'
        @set-rating='setRating'
      )

      recipient(
        v-if='!isSender'
        :transactionsOwner='transactionsOwner'
        :transactions='transactions'
      )

      h4.text-center(v-show="waitingInitTable") Loading...

      div.text-center(v-show="!waitingInitTable && !transactions.length")
        | No Record Found

      pagination(:pagination="pagination")
</template>

<script>
import async from "async";

function initData(data) {
  data.isMe = false;
  data.isSender = false;
  data.transactionsOwner = null;
  data.transactions = [];
  data.transactionsRated = [];
  data.tx = { rating: {} };
  data.result = null;
  data.value = 0;
  data.waitingInitTable = false;
  data.pagination = {};
  data.avg = { count: 0, sum: 0, result: 0, completed: false };
  return data;
}

export default {
  props: ["web3", "web3Helper", "ratingContract", "etherscanAPIKey"],
  data() {
    return initData({});
  },
  created() {
    const self = this;

    self.init(self);
  },
  watch: {
    $route(to, from) {
      const self = this;

      initData(self);
      self.init(self);
    }
  },
  computed: {
    enableRate() {
      const self = this;
      return (
        self.web3.eth.defaultAccount &&
        self.transactionsOwner.toLowerCase() ===
          self.web3.eth.defaultAccount.toLowerCase()
      );
    }
  },
  methods: {
    init(self) {
      const route = self.$router.currentRoute;

      self.isSender = !!route.query.sender;

      self.transactionsOwner = self.isSender
        ? route.query.sender
        : route.query.recipient;

      if (self.transactionsOwner === "me") {
        self.isMe = true;
        self.transactionsOwner = web3.eth.defaultAccount;
      }

      const contractABI = JSON.parse(self.ratingContract.ABIJson);
      self.contract = self.web3.eth
        .contract(contractABI)
        .at(self.ratingContract.address);

      initTable();

      setTimeout(avg);

      function initTable() {
        self.waitingInitTable = true;

        const page = +(route.query.page || 1);

        $.ajax({
          url: "https://rinkeby.etherscan.io/api",
          data: {
            apikey: self.etherscanAPIKey,
            module: "account",
            action: "txlist",
            address: self.transactionsOwner,
            startblock: 0,
            endblock: 99999999,
            sort: "desc",
            page: page,
            offset: 50
          },
          success(data) {
            self.waitingInitTable = false;

            let txs = [];
            const transactions = [];

            if (data.result.length) {
              if (self.isSender) {
                txs = _.filter(
                  data.result,
                  item =>
                    item.from.toLowerCase() ===
                      self.transactionsOwner.toLowerCase() &&
                    item.to &&
                    item.to.toLowerCase() !==
                      (self.transactionsOwner.toLowerCase() &&
                        self.ratingContract.address.toLowerCase())
                );
              } else {
                txs = _.filter(
                  data.result,
                  item =>
                    item.to.toLowerCase() ===
                    self.transactionsOwner.toLowerCase()
                );
              }

              for (let tx of txs) {
                tx.rating = { id: null, stars: null, review: null };
              }

              setPagination(txs.length);
            }

            async.eachLimit(
              txs,
              10,
              (tx, cb) => {
                getRating(tx, (err, data) => {
                  if (err) throw err;

                  tx.rating.id = parseInt(data.rating[0]);
                  tx.rating.stars = parseInt(data.rating[1]);
                  tx.rating.review = data.rating[2];

                  if (tx.rating.id) {
                    self.transactionsRated.push(tx);
                  }
                  transactions.push(tx);

                  return cb();
                });
              },
              err => {
                if (err) throw err;

                self.transactions = _.orderBy(transactions, "timeStamp", [
                  "desc"
                ]);
                self.transactionsRated = _.orderBy(
                  self.transactionsRated,
                  "timeStamp",
                  ["desc"]
                );
              }
            );

            function setPagination(currentTxsCount) {
              let pagination = {
                path: "transactions",
                page,
                hasPrev: page > 1,
                hasNext: currentTxsCount,
                prev: {
                  page: page - 1
                },
                next: {
                  page: page + 1
                }
              };

              if (self.isSender) {
                pagination.prev.sender = route.query.sender;
                pagination.next.sender = route.query.sender;
              } else {
                pagination.prev.recipient = route.query.recipient;
                pagination.next.recipient = route.query.recipient;
              }

              self.pagination = pagination;
            }
          },
          error(err) {
            if (err) throw err;
          }
        });
      }

      function avg() {
        let txs = [];
        let finished = false;
        let page = 1;
        let maxTxs = 50;

        getTxList();

        function getTxList() {
          $.ajax({
            url: "https://rinkeby.etherscan.io/api",
            data: {
              apikey: self.etherscanAPIKey,
              module: "account",
              action: "txlist",
              address: self.transactionsOwner,
              startblock: 0,
              endblock: 99999999,
              sort: "desc",
              page: page,
              offset: 500
            },
            success(data) {
              let tempTxs = [];

              if (data.result.length) {
                tempTxs = _.filter(
                  data.result,
                  item =>
                    item.to.toLowerCase() ===
                    self.transactionsOwner.toLowerCase()
                );
                txs = txs.concat(tempTxs);

                if (txs.length >= maxTxs) {
                  finished = true;
                }
              } else {
                finished = true;
              }

              if (finished) {
                async.eachLimit(
                  txs,
                  10,
                  (tx, cb) => {
                    getRating(tx, (err, data) => {
                      if (err) throw err;

                      const id = parseInt(data.rating[0]);
                      const stars = parseInt(data.rating[1]);

                      if (id) {
                        self.avg.count += 1;
                        self.avg.sum += stars;
                      }

                      return cb();
                    });
                  },
                  err => {
                    if (err) throw err;

                    if (self.avg.count) {
                      self.avg.result = self.avg.sum / self.avg.count;
                    }

                    self.avg.completed = true;
                  }
                );
              } else {
                page++;
                // Set delay because EtherScan limit API call per second
                setTimeout(getTxList, 300);
              }
            },
            error(err) {
              if (err) throw err;
            }
          });
        }
      }

      function getRating(tx, cb) {
        self.contract.getRating.call(tx.from, tx.hash, (err, data) => {
          if (err) return cb(err);

          return cb(null, { tx, rating: data });
        });
      }
    },
    setRating(hash) {
      const self = this;

      self.tx = _.find(self.transactions, { hash });
    },
    modalCancel() {
      const self = this;

      self.tx = initData({}).tx;
    }
  }
};
</script>
<template lang='pug'>
  div.container-fluid
    rate-modal(:web3-helper='web3Helper' :contract='contract' :transaction='tx', @cancel='modalCancel')

    p <strong>Profile</strong>: {{transactionsOwner.toLowerCase()}}
    div(v-if="!isSender")
      p
        strong Link: &nbsp;
        a(:href="ownerUrl") {{ ownerUrl }}
        br
        span.small (Send the above link to your senders and get them to rate you)

      div.stars
        //| Total rated transactions: <strong>{{avg.count}}</strong>
        //br
        //| Average rating (last 50 rated transactions): <strong>{{avg.result}}</strong>
        //br
        strong Average Rating: &nbsp;
        span(v-if="avg.completed")
          star-rating(:increment="0.5" :rating="avg.result" :star-size="20" :show-rating="false" :inline="true" :read-only="true")
        span.text-muted(v-else)
          | calculating...

    ul.nav.nav-tabs.justify-content-center.mt-4
      li.nav-item
        router-link.nav-link(:to="{path: '/transactions', query: {recipient: isMe ? 'me' : transactionsOwner}}" :class="{active: !isSender}") Received
      li.nav-item
        router-link.nav-link(:to="{path: '/transactions', query: {sender: isMe ? 'me' : transactionsOwner}}" :class="{active: isSender}") Sent

    .tab-content.py-3
      transaction(
        :transactions='transactions'
        :headerComponent='headerComponent'
        @set-rating='setRating'
      )

      h4.text-center(v-show="waitingInitTable") Loading...

      div.text-center(v-show="!waitingInitTable && !isMore")
        | No Record Found

      .row
        .col-md-6.offset-md-3.text-center.my-3
          button.btn.btn-primary.btn-block.btn-lg(v-show="isMore && !waitingInitTable" @click="more()") More
</template>

<script>
import async from "async";

function initData(data) {
  data.baseUrl = `https://${window.location.hostname}/#`;
  data.isProfiles = false;
  data.isMe = false;
  data.isSender = false;
  data.transactionsOwner = null;
  data.transactions = [];
  data.transactionsCache = [];
  data.page = 1;
  data.isMore = true;
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

    self.checkIsProfiles();
    self.more();
    self.calculateAvg();
  },
  watch: {
    $route(to, from) {
      const self = this;

      initData(self);
      self.checkIsProfiles();
      self.more();
      self.calculateAvg();
    }
  },
  computed: {
    headerComponent() {
      const self = this;
      return self.isSender ? "sender-header" : "recipient-header";
    },
    ownerUrl() {
      const self = this;
      return `${self.baseUrl}/profiles/${self.transactionsOwner.toLowerCase()}`;
    }
  },
  methods: {
    getRating(tx, cb) {
      const self = this;

      self.contract.getRating.call(tx.from, tx.hash, (err, data) => {
        if (err) return cb(err);

        return cb(null, { tx, rating: data });
      });
    },
    calculateAvg() {
      const self = this;

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
                  item.to.toLowerCase() === self.transactionsOwner.toLowerCase()
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
                  self.getRating(tx, (err, data) => {
                    if (err) throw err;

                    const id = parseInt(data.rating[0]);
                    const stars = parseInt(data.rating[1]) / 2;

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
    },
    checkIsProfiles() {
      const self = this;

      const route = self.$router.currentRoute;

      if (/^\/profiles/.exec(route.path)) {
        self.isProfiles = true;
      }
    },
    more() {
      const self = this;

      const route = self.$router.currentRoute;

      if (self.isProfiles) {
        self.isSender = false;
        self.transactionsOwner = route.params.address;
      } else {
        self.isSender = !!route.query.sender;
        self.transactionsOwner = self.isSender
          ? route.query.sender
          : route.query.recipient;
      }

      if (self.transactionsOwner === "me") {
        self.isMe = true;
        self.transactionsOwner = web3.eth.defaultAccount;
      }

      const contractABI = JSON.parse(self.ratingContract.ABIJson);
      self.contract = self.web3.eth
        .contract(contractABI)
        .at(self.ratingContract.address);

      initTable(self.page++);

      function initTable(page) {
        self.waitingInitTable = true;

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
            page,
            offset: 50
          },
          success(data) {
            let txs = [];

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

              if (!txs.length) {
                setTimeout(self.more, 500);
              }
            } else {
              self.isMore = false;
            }

            async.eachLimit(
              txs,
              10,
              (tx, cb) => {
                self.getRating(tx, (err, data) => {
                  if (err) throw err;

                  tx.rating.id = parseInt(data.rating[0]);
                  tx.rating.stars = parseInt(data.rating[1]) / 2;
                  tx.rating.review = data.rating[2];

                  self.transactionsCache.push(tx);

                  return cb();
                });
              },
              err => {
                if (err) throw err;

                self.waitingInitTable = false;

                self.transactions = _.orderBy(
                  self.transactionsCache,
                  "timeStamp",
                  ["desc"]
                );
              }
            );
          },
          error(err) {
            if (err) throw err;
          }
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

<template lang='pug'>
  .modal#rateModal.fade
    .modal-dialog
      .modal-content
        .modal-header
          h5.modal-title Add Rating
          button.close(data-dismiss="modal" type="button")
            span ×
        .modal-body#ratingForm
          .form-group
            label Transaction Hash
            a(style="font-size: 0.8rem" :href="'https://rinkeby.etherscan.io/tx/' + tx.hash") {{tx.hash}}
          .form-group
            label Stars
            star-rating(@rating-selected="choose" :increment="0.5" :rating="tx.rating.stars" :star-size="30" :show-rating="false")
          .form-group
            label Review (max 5000 chars)
            textarea.form-control(v-model="tx.rating.review")

        .modal-footer
          button.btn.btn-primary(@click="submit()" :disabled="submitting")
            | {{submitting ? 'Sending...' : 'Submit'}}
          button.btn.btn-secondary(data-dismiss="modal" @click="cancel()")  Cancel
</template>

<script>
export default {
  props: ["web3Helper", "contract", "transaction"],
  data() {
    return {
      tx: { rating: {} },
      submitting: false
    };
  },
  watch: {
    transaction(value) {
      const self = this;

      if (value.hash) {
        self.tx = _.cloneDeep(value);
        $("#rateModal").modal("show");
      }
    }
  },
  methods: {
    choose(newStars) {
      const self = this;

      self.tx.rating.stars = newStars;

      // let stars = self.tx.rating.stars;
      // stars = newStars === stars ? --newStars : newStars;
      // self.tx.rating.stars = stars;
    },
    submit() {
      const self = this;

      const ttrOption = {
        closeButton: true,
        positionClass: "toast-bottom-full-width",
        timeOut: 0,
        extendedTimeOut: 0,
        tapToDismiss: false
      };

      const address = web3.eth.defaultAccount;
      const hash = self.tx.hash;
      const stars = self.tx.rating.stars * 2;
      const review = self.tx.rating.review.trim();

      if (!self.web3Helper.metamaskLogin()) {
        return alert("Please login to MetaMask");
      } else if (!(stars >= 1 && stars <= 10)) {
        return ttr.error("Please give valid stars");
      } else if (review.length < 3) {
        return ttr.error("Review minimal 3 characters");
      } else if (review.length > 5000) {
        return ttr.error("Review maximal 5000 characters");
      }

      self.submitting = true;
      self.contract.rate.estimateGas(hash, stars, review, (err, data) => {
        if (err) {
          self.submitting = false;
          throw err;
        }

        self.contract.rate.sendTransaction(
          hash,
          stars,
          review,
          { gas: data, gasPrice: 30 * 1e9 },
          (err, data) => {
            self.submitting = false;

            if (err) {
              throw err;
            }

            self.tx = { rating: {} };
            $("#rateModal").modal("hide");

            const link = `<a class="btn btn-primary" href="${
              self.web3Helper.viewTxPath
            }/${data}" target="_blank">
        View Transaction on Etherscan</a>`;
            ttr.success(`Transaction Success. ${link}`, null, ttrOption);
          }
        );
      });
    },
    cancel() {
      const self = this;

      self.$emit("cancel");
    }
  }
};
</script>


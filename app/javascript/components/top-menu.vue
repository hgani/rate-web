<template lang='pug'>
  nav.navbar.navbar-expand-lg.navbar-light.bg-light
    .container-fluid
      router-link.navbar-brand(to="/") RateMe Dapp
      button.navbar-toggler(aria-controls='navbarSupportedContent', aria-expanded='false', aria-label='Toggle navigation', data-target='#navbarSupportedContent', data-toggle='collapse', type='button')
        span.navbar-toggler-icon
      #navbarSupportedContent.collapse.navbar-collapse
        ul.navbar-nav.ml-auto.mr-1
          li.nav-item(v-if="web3.eth.defaultAccount")
            router-link.nav-link(:to="{path: 'transactions', query: {sender: 'me'}}") Me     
          li.nav-item    
            .form-inline
              input#searchQuery.form-control.mr-sm-2(type="search" v-model="searchQuery" placeholder="Enter an ETH address to view its rating")
              button#searchButton.btn.my-2.my-sm-0(@click="search" Search) Go
          li.nav-item
            span.small.navbar-text.pl-1 Net: {{node.network}}
</template>

<script>
export default {
  props: ["web3", "node"],
  data() {
    return {
      searchQuery: null
    };
  },
  methods: {
    search() {
      const self = this;

      if (self.searchQuery) {
        self.$router.push({
          path: "transactions",
          query: { recipient: self.searchQuery }
        });
      }
    }
  }
};
</script>

<style lang='scss'>
#searchQuery {
  width: 303px;
}
</style>


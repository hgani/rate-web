import _ from 'lodash';
import Vue from 'vue/dist/vue.esm';
import VueRouter from 'vue-router';
import utils from '../utils';
import web3Helper from '../web3-helper';
import ratingContract from '../rating-contract';

import StarRating from 'vue-star-rating'

import NoMetaMask from '../components/no-metamask';
import TopMenu from '../components/top-menu';
import SideMenu from '../components/side-menu';
import Pagination from '../components/pagination';
import App from '../components/app';
import Transactions from '../components/transactions';
import RateModal from '../components/rate-modal';
import Sender from '../components/sender';
import Recipient from '../components/recipient';

const web3 = global.web3;
const etherscanAPIKey = '8XY5G7CC8CYMAJ267UBE58QNWDG1H49JHT';

$(() => {
  web3Helper.checkMetamask(4);

  toastr.options.positionClass = 'toast-top-center';
  window.ttr = toastr;
  const csrfToken = $("meta[name=csrf-token]").attr("content");

  Vue.use(VueRouter);

  // register components
  Vue.component('star-rating', StarRating);
  Vue.component('top-menu', TopMenu);
  Vue.component('side-menu', SideMenu);
  Vue.component('pagination', Pagination);
  Vue.component('rate-modal', RateModal);
  Vue.component('sender', Sender);
  Vue.component('recipient', Recipient);

  global.vm = new Vue({
    el: '#vueRoot',
    router: new VueRouter({
      routes: [{
        path: '/',
        component: web3 ? App : NoMetaMask,
        props: {
          web3,
          web3Helper
        },
        children: [{
            path: '',
            component: {
              template: '<div class="h1 jumbotron text-center">Rating App</div>'
            }
          },
          {
            path: 'transactions',
            component: Transactions,
            props: {
              web3,
              web3Helper,
              ratingContract,
              etherscanAPIKey
            }
          }
        ]
      }]
    })
  });
});

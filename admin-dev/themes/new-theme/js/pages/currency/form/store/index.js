/**
 * 2007-2019 PrestaShop SA and Contributors
 *
 * NOTICE OF LICENSE
 *
 * This source file is subject to the Open Software License (OSL 3.0)
 * that is bundled with this package in the file LICENSE.txt.
 * It is also available through the world-wide-web at this URL:
 * https://opensource.org/licenses/OSL-3.0
 * If you did not receive a copy of the license and are unable to
 * obtain it through the world-wide-web, please send an email
 * to license@prestashop.com so we can send you a copy immediately.
 *
 * DISCLAIMER
 *
 * Do not edit or add to this file if you wish to upgrade PrestaShop to newer
 * versions in the future. If you wish to customize PrestaShop for your
 * needs please refer to https://www.prestashop.com for more information.
 *
 * @author    PrestaShop SA <contact@prestashop.com>
 * @copyright 2007-2019 PrestaShop SA and Contributors
 * @license   https://opensource.org/licenses/OSL-3.0 Open Software License (OSL 3.0)
 * International Registered Trademark & Property of PrestaShop SA
 */
import Vue from 'vue';
import Vuex from 'vuex';
import CurrencyActions from './actions';
import mutations from './mutations';
import getters from './getters';

Vue.use(Vuex);

// root state object.
const state = {
  languages: [],
  translations: {},
  currencyData: null,
  editedLanguage: {},
  customData: {
    symbol: '',
    transformation: ''
  },
  showCurrencyModal: false
};

// A Vuex instance is created by combining the state, mutations, actions,
// and getters.
export default (referenceUrl) => {
  const actions = new CurrencyActions(referenceUrl);

  return new Vuex.Store({
    state,
    getters,
    actions,
    mutations,
    strict: true
  })
};

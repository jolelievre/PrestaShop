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
import VueResource from 'vue-resource';
import * as types from './mutation-types';
import { showGrowl } from 'app/utils/growl';

Vue.use(VueResource);

export default function(referenceUrl) {
  this.referenceCurrency = Vue.resource(referenceUrl);

  async function fetchCurrency(currencyResource, currencyIsoCode) {
    let currencyData = null;
    if (currencyIsoCode) {
      await currencyResource.get({id: currencyIsoCode}).then((response) => {
        currencyData = response.body;
      }, (errorResponse) => {
        if (errorResponse.body && errorResponse.body.error) {
          showGrowl('error', errorResponse.body.error, 3000);
        } else {
          showGrowl('error', 'Can not find CLDR data for currency ' + currencyIsoCode, 3000);
        }
      });
    }
    if (currencyData && currencyData.transformations === undefined) {
      currencyData.transformations = {};
      for (let langId in currencyData.symbols) {
        currencyData.transformations[langId] = '';
      }
    }

    return currencyData;
  }

  return {
    fetchReferenceData: async ({ commit }, currencyIsoCode) => {
      const currencyData = await fetchCurrency(this.referenceCurrency, currencyIsoCode);
      commit(types.SET_CURRENCY_DATA, currencyData);
    },

    editLanguageFormat: ({commit}, language) => {
      commit(types.SET_EDITED_LANGUAGE, language);
      commit(types.SET_CURRENCY_MODAL_VISIBLE, true);
    },
    customizeCurrencyFormat: ({commit}) => {
      commit(types.CUSTOMIZE_CURRENCY_FORMAT);
    },

    resetLanguage: ({commit}, language) => {
      commit(types.RESET_LANGUAGE, { language });
    },
    resetAllLanguages: ({state, commit}) => {
      state.languages.forEach((language) => {
        commit(types.RESET_LANGUAGE, { language });
      });
    },

    showCurrencyModal: ({commit}) => {
      commit(types.SET_CURRENCY_MODAL_VISIBLE, true);
    },
    hideCurrencyModal: ({commit}) => {
      commit(types.SET_CURRENCY_MODAL_VISIBLE, false);
    },

    setCurrencyData: ({commit}, currencyData) => {
      commit(types.SET_CURRENCY_DATA, currencyData);
    },
    setLanguages: ({commit}, languages) => {
      commit(types.SET_LANGUAGES, languages);
    },
    setTranslations: ({commit}, translations) => {
      commit(types.SET_TRANSLATIONS, translations);
    },
    setCustomSymbol: ({commit}, symbol) => {
      commit(types.SET_CUSTOM_SYMBOL, symbol);
    },
    setCustomTransformation: ({commit}, transformation) => {
      commit(types.SET_CUSTOM_TRANSFORMATION, transformation);
    },
  }
}


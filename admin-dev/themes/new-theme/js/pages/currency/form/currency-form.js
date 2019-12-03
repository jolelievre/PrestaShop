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
import VueI18n from 'vue-i18n';
import CurrencyFormatter from './components/CurrencyFormatter.vue';
import CurrencyStore from './store';
import * as types from './store/mutation-types';

export default class CurrencyForm {
  /**
   * @param {object} currencyFormMap - Page map
   */
  constructor(currencyFormMap) {
    this.map = currencyFormMap;
    this.$currencyForm = $(this.map.currencyForm);
    this.$currencyFormFooter = $(this.map.currencyFormFooter);
    this.apiReferenceUrl = this.$currencyForm.data('reference-url');
    this.languages = this.$currencyForm.data('languages');
    this.translations = this.$currencyForm.data('translations');
    this.$currencySelector = $(this.map.currencySelector);
    this.$isUnofficialCheckbox = $(this.map.isUnofficialCheckbox);
    this.$isoCodeInput = $(this.map.isoCodeInput);
    this.$exchangeRateInput = $(this.map.exchangeRateInput);
    this.$precisionInput = $(this.map.precisionInput);
    this.$resetDefaultSettingsButton = $(this.map.resetDefaultSettingsInput);
    this.$loadingDataModal = $(this.map.loadingDataModal);
    this.currencyFormatterId = this.map.currencyFormatter.replace('#', '');
  }

  init() {
    this._initListeners();
    this._initFields();
    this._initStore();
    this._initCurrencyFormatter();
  }

  _initStore() {
    this.store = new CurrencyStore(this.apiReferenceUrl, {
      languages: this.languages,
      translations: this.translations,
      currencyData: this._getCurrencyDataFromForm()
    });

    this.store.subscribe((mutation, state) => {
      if (types.CUSTOMIZE_CURRENCY_FORMAT === mutation.type ||
        types.RESET_LANGUAGE === mutation.type) {
        this._fillCurrencyCustomData(state.currencyData);
      }
    });
  }

  _initCurrencyFormatter() {
    // Customizer only present when languages data are present (in edition usually)
    if (!this.languages.length) {
      return;
    }

    $(`<div id="${this.currencyFormatterId}"></div>`).insertBefore(this.$currencyFormFooter);
    this.currencyFormatter = new Vue({
        el: this.map.currencyFormatter,
        store: this.store,
        i18n: new VueI18n({
          locale: 'en',
          messages: { en: this.translations }
        }),
        components: {CurrencyFormatter},
        template: `<currency-formatter></currency-formatter>`
    });
  }

  _initListeners() {
    this.$currencySelector.change(this._onCurrencySelectorChange.bind(this));
    this.$isUnofficialCheckbox.change(this._onIsUnofficialCheckboxChange.bind(this));
    this.$resetDefaultSettingsButton.click(this._onResetDefaultSettingsClick.bind(this));
  }

  _initFields() {
    if (!this._isUnofficialCurrency()) {
      this.$isUnofficialCheckbox.prop('checked', false);
      this.$isoCodeInput.prop('readonly', true);
    } else {
      this.$currencySelector.val('');
      this.$isoCodeInput.prop('readonly', false);
    }
  }

  _onCurrencySelectorChange() {
    const selectedISOCode = this.$currencySelector.val();
    if ('' !== selectedISOCode) {
      this.$isUnofficialCheckbox.prop('checked', false);
      this.$isoCodeInput.prop('readonly', true);
      this._resetCurrencyData(selectedISOCode);
    } else {
      this.$isUnofficialCheckbox.prop('checked', true);
      this.$isoCodeInput.prop('readonly', false);
    }
  }

  _isUnofficialCurrency() {
    if ('hidden' === this.$isUnofficialCheckbox.prop('type')) {
      return '1' === this.$isUnofficialCheckbox.attr('value');
    }

    return this.$isUnofficialCheckbox.prop('checked');
  }

  _onIsUnofficialCheckboxChange() {
    if (this._isUnofficialCurrency()) {
      this.$currencySelector.val('');
      this.$isoCodeInput.prop('readonly', false);
    } else {
      this.$isoCodeInput.prop('readonly', true);
    }
  }

  _onResetDefaultSettingsClick() {
    this._resetCurrencyData(this.$isoCodeInput.val());
  }

  async _resetCurrencyData(selectedISOCode) {
    this.$loadingDataModal.modal('show');
    this.$resetDefaultSettingsButton.addClass('spinner');

    await this.store.dispatch('fetchReferenceData', selectedISOCode);
    const currencyData = this.store.getters.currencyData;
    this._fillCurrencyData(currencyData);
    this.store.dispatch('resetAllLanguages');

    this.$loadingDataModal.modal('hide');
    this.$resetDefaultSettingsButton.removeClass('spinner');
  }

  _fillCurrencyData(currencyData) {
    if (!currencyData) {
      return;
    }
    for (let langId in currencyData.names) {
      let langNameSelector = this.map.namesInput(langId);
      $(langNameSelector).val(currencyData.names[langId]);
    }
    this._fillCurrencyCustomData(currencyData);
    this.$isoCodeInput.val(currencyData.isoCode);
    this.$exchangeRateInput.val(currencyData.exchangeRate);
    this.$precisionInput.val(currencyData.precision);
  }

  _fillCurrencyCustomData(currencyData) {
    for (let langId in currencyData.symbols) {
      let langSymbolSelector = this.map.symbolsInput(langId);
      $(langSymbolSelector).val(currencyData.symbols[langId]);
    }
    for (let langId in currencyData.transformations) {
      let langTransformationSelector = this.map.transformationsInput(langId);
      $(langTransformationSelector).val(currencyData.transformations[langId]);
    }
  }

  _getCurrencyDataFromForm() {
    let currencyData = {
      names: {},
      symbols: {},
      transformations: {},
      isoCode: this.$isoCodeInput.val(),
      exchangeRate: this.$exchangeRateInput.val(),
      precision: this.$precisionInput.val()
    };

    this.languages.forEach((lang) => {
      currencyData.names[lang.id] = $(this.map.namesInput(lang.id)).val();
      currencyData.symbols[lang.id] = $(this.map.symbolsInput(lang.id)).val();
      currencyData.transformations[lang.id] = $(this.map.transformationsInput(lang.id)).val();
    });

    return currencyData;
  }
}

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
import * as types from './mutation-types';

export default {
  [types.CUSTOMIZE_CURRENCY_FORMAT](state) {
    const editedLanguage = state.editedLanguage;
    const customData = state.customData;

    const selectedPattern = editedLanguage.transformations[customData.transformation];
    const patterns = selectedPattern.split(';');

    editedLanguage.priceSpecification.currencySymbol = customData.symbol;
    editedLanguage.priceSpecification.positivePattern = patterns[0];
    editedLanguage.priceSpecification.negativePattern = patterns.length > 1 ? patterns[1] : '-' + patterns[0];

    state.currencyData.transformations[editedLanguage.id] = customData.transformation;
    state.currencyData.symbols[editedLanguage.id] = customData.symbol;
  },

  [types.RESET_LANGUAGE](state, { language }) {
    language.priceSpecification.currencySymbol = language.currencySymbol;
    const patterns = language.currencyPattern.split(';');
    language.priceSpecification.positivePattern = patterns[0];
    language.priceSpecification.negativePattern = patterns.length > 1 ? patterns[1] : '-' + patterns[0];

    state.currencyData.transformations[language.id] = '';
    state.currencyData.symbols[language.id] = language.currencySymbol;
  },

  [types.SET_EDITED_LANGUAGE](state, language) {
    state.editedLanguage = language;
  },
  [types.SET_CURRENCY_DATA](state, currencyData) {
    state.currencyData = currencyData;
  },
  [types.SET_LANGUAGES](state, languages) {
    state.languages = languages;
  },
  [types.SET_TRANSLATIONS](state, translations) {
    state.translations = translations;
  },
  [types.SET_CUSTOM_SYMBOL](state, symbol) {
    state.customData.symbol = symbol;
  },
  [types.SET_CUSTOM_TRANSFORMATION](state, transformation) {
    state.customData.transformation = transformation;
  },
  [types.SET_CURRENCY_MODAL_VISIBLE](state, visible) {
    state.currencyModalVisible = visible;
  }
}

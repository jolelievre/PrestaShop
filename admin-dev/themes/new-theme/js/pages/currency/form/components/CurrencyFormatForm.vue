<!--**
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
 *-->
<template>
  <div class="row">
    <div class="col-4">
      <h4>{{$t('1. Enter symbol')}}</h4>
      <input type="text" v-model="customSymbol">
    </div>
    <div class="col-8 border-left">
      <h4>{{$t('2. Choose format')}}</h4>
      <div class="row">
        <div class="ps-radio col-6" v-for="(pattern, transformation) in availableFormats" :key="transformation" :id="transformation">
          <input type="radio" :checked="transformation === customTransformation" :value="transformation" v-model="customTransformation" />
          <label @click="customTransformation = transformation">
            {{ displayPattern(pattern) }}
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex';
  import { NumberFormatter } from 'app/cldr';

  export default {
    name: 'currency-format-form',
    computed: {
      ...mapGetters([
        'editedLanguage',
        'customData'
      ]),
      availableFormats() {
        return this.editedLanguage.transformations;
      },
      customSymbol: {
        get() {
          return this.customData.symbol;
        },
        set(value) {
          this.setCustomSymbol(value);
        }
      },
      customTransformation: {
        get() {
          return this.customData.transformation;
        },
        set(value) {
          this.setCustomTransformation(value);
        }
      }
    },
    methods: {
      ...mapActions([
        'setCustomSymbol',
        'setCustomTransformation'
      ]),
      displayPattern(pattern) {
        const patterns = pattern.split(';');
        const priceSpecification = JSON.parse(JSON.stringify(this.editedLanguage.priceSpecification));
        priceSpecification.positivePattern = patterns[0];
        priceSpecification.negativePattern = patterns.length > 1 ? patterns[1] : '-' + pattern;
        priceSpecification.currencySymbol = this.customSymbol;

        const currencyFormatter = NumberFormatter.build(priceSpecification);

        return currencyFormatter.format(14251999.42);
      }
    },
    mounted() {
      this.customSymbol = this.editedLanguage.priceSpecification.currencySymbol;
      const currencyPattern = this.editedLanguage.priceSpecification.positivePattern;

      // Detect which transformation matches the language pattern
      for (let transformation in this.editedLanguage.transformations) {
        let transformationPatterns = this.editedLanguage.transformations[transformation].split(';');
        if (transformationPatterns[0] === currencyPattern) {
          this.customTransformation = transformation;
          break;
        }
      }
    }
  }
</script>

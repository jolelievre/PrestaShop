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
  <table class="grid-table js-grid-table table">
    <thead class="thead-default">
    <tr class="column-headers">
      <th scope="col">
        {{trans('Language')}}
      </th>
      <th scope="col">
        {{trans('Example')}}
      </th>
      <th scope="col">
        <div class="text-right">
          {{trans('Edit symbol / format')}}
        </div>
      </th>
      <th scope="col">
        <div class="grid-actions-header-text">
          {{trans('Reset settings')}}
        </div>
      </th>
    </tr>
    </thead>
    <tbody>
    <tr v-for="language in languages" :key="language.id">
      <td>
        {{ language.name }}
      </td>
      <td>
        {{ displayFormat(language) }}
      </td>
      <td>
        <div class="btn-group-action text-right">
          <div class="btn-group">
            <a class="btn" @click="editLanguageFormat(language)">
              <i class="material-icons">edit</i>
            </a>
          </div>
        </div>
      </td>
      <td>
        <div class="btn-group-action text-right">
          <div class="btn-group">
            <a class="btn" @click="resetLanguage(language)">
              <i class="material-icons">refresh</i>
            </a>
          </div>
        </div>
      </td>
    </tr>
    </tbody>
  </table>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex';
  import { NumberFormatter } from 'app/cldr';

  export default {
    name: 'language-list',
    data() {
      return {
        editedLanguage: '',
        editedSymbol: '',
      }
    },
    computed: {
      ...mapGetters([
        'languages'
      ])
    },
    methods: {
      ...mapActions([
        'editLanguageFormat',
        'resetLanguage'
      ]),
      displayFormat(language) {
        const currencyFormatter = NumberFormatter.build(language.priceSpecification);

        return this.trans('Price: %price% (Special discount %discount%)', {
          '%price%': currencyFormatter.format(14251999.42),
          '%discount%': currencyFormatter.format(-566.268)
        });
      }
    }
  }
</script>

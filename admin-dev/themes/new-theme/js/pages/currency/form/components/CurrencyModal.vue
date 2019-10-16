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
  <div class="modal fade" id="ps-modal" tabindex="-1" role="dialog">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{trans('Customize symbol and format')}} - {{ editedLanguage.name }}</h5>
          <button type="button" class="close" data-dismiss="modal">
            <i class="material-icons">close</i>
          </button>
        </div>

        <div class="modal-body">
          <currency-format-form v-if="showCustomizer"></currency-format-form>
        </div>
        <div class="modal-footer">
          <PSButton @click="saveCustomCurrency" class="btn-lg" primary data-dismiss="modal">{{trans('Apply')}}</PSButton>
          <PSButton @click="hideModal" class="btn-lg" ghost data-dismiss="modal">{{trans('Cancel')}}</PSButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex';
  import PSButton from 'app/widgets/ps-button';
  import CurrencyFormatForm from './CurrencyFormatForm';

  export default {
    name: 'currency-modal',
    data() {
      return {
        showCustomizer: false
      }
    },
    components: {
      CurrencyFormatForm,
      PSButton,
    },
    computed: {
      ...mapGetters([
        'editedLanguage',
        'customData',
        'showCurrencyModal'
      ])
    },
    methods: {
      ...mapActions([
        'customizeCurrencyFormat',
        'setShowCurrencyModal'
      ]),
      saveCustomCurrency() {
        this.customizeCurrencyFormat();
        this.hideModal();
      },
      showModal() {
        $(this.$el).modal('show');
      },
      hideModal() {
        $(this.$el).modal('hide');
      }
    },
    mounted() {
      // It's better to toggle customizer on modal event because it can be hidden by clicking out side of the modal
      // And we use this boolean to force remount the CurrencyCustomizer and re-init the symbol
      $(this.$el).on('show.bs.modal', () => {
        this.showCustomizer = true;
      });
      $(this.$el).on('hidden.bs.modal', () => {
        this.showCustomizer = false;
        this.setShowCurrencyModal(false);
      });
    },
    created() {
      this.$store.watch(
        (state, getters) => state.showCurrencyModal,
        (newValue, oldValue) => {
          if (newValue !== oldValue && newValue) {
            this.showModal();
          }
        },
      );
    },
  };
</script>

<style lang="scss" scoped>
  @import "../../../../../scss/config/_settings.scss";
  .modal-header .close {
    font-size: 1.2rem;
    color: $gray-medium;
    opacity: 1;
  }
  .modal-content {
    border-radius: 0
  }
</style>

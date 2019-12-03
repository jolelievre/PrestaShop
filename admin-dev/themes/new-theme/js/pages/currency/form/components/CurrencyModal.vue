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
  <modal
    confirmation
    :modalTitle="modalTitle"
    v-if="currencyModalVisible"
    @close="closeModal"
    @confirm="saveCustomCurrency"
  >
    <template slot="body">
      <currency-format-form></currency-format-form>
    </template>
  </modal>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex';
  import CurrencyFormatForm from './CurrencyFormatForm';
  import Modal from 'psvue/components/Modal';

  export default {
    name: 'currency-modal',
    components: {
      CurrencyFormatForm,
      Modal,
    },
    computed: {
      ...mapGetters([
        'editedLanguage',
        'currencyModalVisible'
      ]),
      modalTitle() {
        return this.$t('Customize symbol and format') + ' + ' + this.editedLanguage.name;
      }
    },
    methods: {
      ...mapActions([
        'customizeCurrencyFormat',
        'hideCurrencyModal'
      ]),
      closeModal() {
        this.hideCurrencyModal();
      },
      saveCustomCurrency() {
        this.customizeCurrencyFormat();
        this.closeModal();
      }
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

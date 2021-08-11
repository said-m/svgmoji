<script>
  import { ContextMenuModesEnum } from '../../interfaces';
  import { isEnumValue } from '@said-m/common';
  import RadioField from '../../components/radio-field.svelte';

  export let mode;

  function onChange() {
    if (isEnumValue(mode, ContextMenuModesEnum)) {
      const updates = {
        contextMenuMode: mode,
      };

      console.log('Обновление настроек контекстного меню:', mode);
      chrome.storage.sync.set(updates);
    }
  }
</script>

<style lang="scss">
  fieldset {
    display: flex;
    flex-direction: column;
    gap: 7px;
  }
</style>

<div>
  <h2>Context menu mode</h2>

  <fieldset>
    <RadioField
      class="option"
      bind:group={mode}
      value={ContextMenuModesEnum.nested}
      on:change={onChange}
    >
      Submenu with a list of sources
    </RadioField>

    <RadioField
      class="option"
      bind:group={mode}
      value={ContextMenuModesEnum.simple}
      on:change={onChange}
    >
      Action button at the root of menu (use source priority settings)
    </RadioField>
  </fieldset>
</div>

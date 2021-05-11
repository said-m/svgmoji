<script>
  import { CopyModesEnum } from '../../interfaces';
  import { isEnumValue } from '@said-m/common';
  import RadioField from '../../components/radio-field.svelte';

  export let mode;

  function onChange() {
    if (isEnumValue(mode, CopyModesEnum)) {
      const updates = {
        copyMode: mode,
      };

      console.log('Обновление настроек режима копирования:', mode);
      chrome.storage.sync.set(updates);
    }
  }
</script>

<style lang="scss">
  .component {
    display: flex;
    flex-direction: column;
    gap: 7px;

    > :global(.option) {
      display: flex;
      flex-direction: row;
      gap: 7px;
      align-items: baseline;
    }
  }
</style>

<fieldset class="component">
  <h2>Copy mode</h2>

  <RadioField
    class="option"
    bind:group={mode}
    value={CopyModesEnum.link}
    on:change={onChange}
  >
    A link to an image
  </RadioField>

  <RadioField
    class="option"
    bind:group={mode}
    value={CopyModesEnum.image}
    on:change={onChange}
  >
    An image
  </RadioField>
</fieldset>

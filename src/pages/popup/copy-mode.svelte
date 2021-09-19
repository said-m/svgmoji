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
  fieldset {
    display: flex;
    flex-direction: column;
    gap: 7px;
  }
</style>

<div class="component">
  <h2>Copy mode</h2>

  <fieldset>
    <RadioField
      class="option"
      bind:group={mode}
      value={CopyModesEnum.link}
      on:change={onChange}
    >
      Link to an image
    </RadioField>

    <RadioField
      class="option"
      bind:group={mode}
      value={CopyModesEnum.image}
      on:change={onChange}
    >
      Image
    </RadioField>
  </fieldset>
</div>

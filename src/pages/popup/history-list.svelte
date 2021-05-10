<script>
  import { CopyModesEnum } from '../../interfaces';
  import { popupStore } from './store';
  import EmojiButton from '../../components/emoji-button.svelte';

  export let items;

  $: reversedList = items.reverse();

  function onClick({
    item,
  }) {
    copy({
      value: item.link,
      asImage: popupStore.copyMode === CopyModesEnum.image,
    }).catch(
      (error) => console.error(`Ошибка при копировании в буфер обмена: ${error}`),
    )
  }
</script>

<template>
  <h2>Recently copied emojis</h2>

  {#if reversedList.length}
    <div class="list">
      {#each reversedList as thisItem (thisItem.link)}
        <EmojiButton
          url={thisItem.link}
          on:click={() => onClick({
            item: thisItem,
          })}
        />
      {/each}
    </div>
  {:else}
    <p>history is empty</p>
  {/if}
</template>

<style lang="scss">
  .list {
    display: grid;
    grid-template-columns: repeat(10, 1fr);
    gap: 7px;
  }
</style>

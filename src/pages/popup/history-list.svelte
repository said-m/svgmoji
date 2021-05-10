<script>
  import { CopyModesEnum } from '../../interfaces';
  import EmojiButton from '../../components/emoji-button.svelte';
  import { copy } from '../../helpers';

  export let items;
  export let mode = CopyModesEnum.link;

  $: reversedList = items.reverse();

  function onClick({
    item,
  }) {
    copy({
      value: item.link,
      asImage: mode === CopyModesEnum.image,
    }).catch(
      (error) => console.error(`Ошибка при копировании в буфер обмена: ${error}`),
    )
  }
</script>

<div>
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
</div>

<style lang="scss">
  .list {
    display: grid;
    grid-template-columns: repeat(10, 1fr);
    gap: 7px;
  }
</style>

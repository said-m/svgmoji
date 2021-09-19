<script>
  import CopyMode from './copy-mode.svelte';
  import ContextMenuMode from './context-menu-mode.svelte';
  import SourcePrioritization from './source-prioritization.svelte';
  import HistoryList from './history-list.svelte';

  export let history;
  export let sources;
  export let sourcePrioritization;
  export let contextMenuMode;
  export let copyMode;
</script>

<div class="component">
  {#if history && copyMode}
    <HistoryList items={history} mode={copyMode}/>
  {:else}
    loading history list
  {/if}

  {#if sources && sourcePrioritization}
    <SourcePrioritization items={sources} order={sourcePrioritization}/>
  {:else}
    getting source prioritization settings
  {/if}

  {#if contextMenuMode}
    <ContextMenuMode mode={contextMenuMode}/>
  {:else}
    getting context menu mode
  {/if}

  {#if copyMode}
    <CopyMode mode={copyMode}/>
  {:else}
    getting copy mode
  {/if}
</div>

<style lang="scss">
  .component {
    min-width: 400px;
    padding: 15px;

    display: flex;
    flex-direction: column;
    gap: 15px;
  }
</style>

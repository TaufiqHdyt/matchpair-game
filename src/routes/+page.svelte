<script lang="ts">
  import { app } from '$lib/config'
  import { emoji } from '$lib/emoji'

  type State = 'init' | 'playing' | 'paused' | 'won' | 'lost'

  let state: State = 'init'
  let size: number = 20
  let grid = createGrid()
  let maxMatches = grid.length / 2 // only unique emojies
  let selected: number[] = []
  let matches: string[] = []

  function createGrid() {
    let cards = new Set<string>()
    let maxSize = size / 2

    while (cards.size < maxSize) {
      const randomIndex = Math.floor(Math.random() * emoji.length)
      cards.add(emoji[randomIndex])
    }

    return shuffle([...cards, ...cards])
  }

  function shuffle<Items>(array: Items[]) {
    return array.sort(() => Math.random() - 0.5)
  }

  console.log(grid)
</script>

{#if state === 'init'}
  <h1>{app.title}</h1>
  <button on:click={() => (state = 'playing')}>Start Play</button>
{/if}

{#if state === 'playing'}
  <div class="cards">
    {#each grid as card, cardIndex}
      <button class="card">
        <div>{card}</div>
      </button>
    {/each}
  </div>
{/if}

{#if state === 'lost'}
  <h1>You Lost: 😢</h1>
  <button on:click={() => (state = 'playing')}>Play Again</button>
{/if}

{#if state === 'won'}
  <h1>You Won: 🎉</h1>
  <button on:click={() => (state = 'playing')}>Play Again</button>
{/if}

<style>
  .cards {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 0.5rem;
  }

  .card {
    height: 10rem;
    width: 8rem;
    font-size: 4rem;
    background-color: var(--bg-secondary);

    &.selected {
      border: 4px solid var(--border);
    }
  }
</style>

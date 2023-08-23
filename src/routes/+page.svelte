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

  function selectCard(cardIndex: number) {
    selected = selected.concat(cardIndex)
  }

  function matchCards() {
    const [first, second] = selected

    if (grid[first] === grid[second]) {
      matches = matches.concat(grid[first])
    }

    setTimeout(() => (selected = []), 250)
  }

  function gameWon() {
    state = 'won'
  }

  $: selected.length === 2 && matchCards()
  $: maxMatches === matches.length && gameWon()

  $: console.log({ state, selected, matches })
</script>

{#if state === 'init'}
  <h1>{app.title}</h1>
  <button on:click={() => (state = 'playing')}>Start Play</button>
{/if}

{#if state === 'playing'}
  <div class="play">
    <div class="matches">
      {#each matches as card}
        <div>{card}</div>
      {/each}
    </div>
    <div class="cards">
      {#each grid as card, cardIndex}
        {@const isSelected = selected.includes(cardIndex)}
        {@const isSelectedOrMatched = selected.includes(cardIndex) || matches.includes(card)}
        {@const match = matches.includes(card)}
        <button
          class="card"
          class:selected={isSelected}
          disabled={isSelectedOrMatched}
          on:click={() => selectCard(cardIndex)}
        >
          <div class:match>{card}</div>
        </button>
      {/each}
    </div>
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
  .play {
    display: grid;
    grid-template-columns: 1fr 9fr;
  }
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

    & .match {
      transition: opacity 0.25s ease-out;
      opacity: 0.4;
      cursor: default;
    }
  }

  .matches {
    display: flex;
    flex-direction: column;
    text-align: center;
    gap: 0.5rem;
    font-size: 2.5rem;
  }
</style>

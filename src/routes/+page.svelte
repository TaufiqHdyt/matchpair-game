<script lang="ts">
  import { app } from '$lib/config'
  import { emoji } from '$lib/emoji'

  type State = 'waiting' | 'playing' | 'paused' | 'gameover'
  type Type = 'START' | 'ESCAPE' | 'TICK' | 'CLICK'

  import { useMachine } from '$lib/machine'

  let size: number = 20
  let grid = createGrid()
  let maxMatches = grid.length / 2 // only unique emojies
  let selected: number[] = []
  let matches: string[] = []
  let timerId: NodeJS.Timeout | null = null
  let time: number = 60

  function gameMachine(state: State, event: { type: Type, data: number }) {
    switch (state) {
      case 'waiting':
        if (event.type === 'START') {
          return 'playing'
        }
      case 'playing':
        if (event.type === 'ESCAPE') {
          stopGameTimer()
          return 'paused'
        }

        if (event.type === 'TICK') {
          if (event.data === 0) {
            stopGameTimer()
            return 'gameover'
          }
        }

        if (event.type === 'CLICK') {
          selectCard(event.data)
          selected.length === 2 && matchCards()

          if (matches.length === maxMatches) {
            stopGameTimer()
            return 'gameover'
          }

          return 'playing'
        }
      case 'paused':
        if (event.type === 'ESCAPE') {
          startGameTimer()
          return 'playing'
        }
      case 'gameover':
        if (event.type === 'START') {
          resetGame()
          return 'playing'
        }
      default:
        return state
    }
  }

  const { state, send } = useMachine(gameMachine, 'waiting')

  function startGameTimer() {
    function countdown() {
      if ($state !== 'paused') {
        time -= 1
        send({ type: 'TICK', data: time })
      }
    }

    timerId = setInterval(countdown, 1000)
  }

  function stopGameTimer() {
    timerId && clearInterval(timerId)
  }

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

  function resetGame() {
    grid = createGrid()
    maxMatches = grid.length / 2
    selected = []
    matches = []
    timerId = null
    time = 60
  }

  function pauseGame(e: KeyboardEvent) {
    e.key === 'Escape' && send({ type: 'ESCAPE' })
  }

  $: if ($state === 'playing') {
    !timerId && startGameTimer()
  }
</script>

<svelte:window on:keyup={pauseGame} />

{#if $state === 'waiting'}
  <h1>{app.title}</h1>
  <button on:click={() => send({ type: 'START' })}>Start Play</button>
{/if}

{#if $state === 'paused'}
  <h1>Game paused</h1>
{/if}

{#if $state === 'playing'}
  <h1 class="timer" class:pulse={$state !== 'paused' && time <= 10}>
    {time}
  </h1>
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
          class:flip={isSelectedOrMatched}
          disabled={isSelectedOrMatched}
          on:click={() => send({ type: 'CLICK', data: cardIndex })}
        >
          <div class="back" class:match>{card}</div>
        </button>
      {/each}
    </div>
  </div>
{/if}

{#if $state === 'gameover'}
  {#if matches.length === maxMatches}
    <h1>You Won: 🎉</h1>
  {:else}
    <h1>You Lost: 😢</h1>
  {/if}
  <button on:click={() => send({ type: 'START' })}>Play Again</button>
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
    transition: rotate 0.3s ease-out;
    transform-style: preserve-3d;

    &.selected {
      border: 4px solid var(--border);
    }

    &.flip {
      rotate: y 180deg;
      pointer-events: none;
    }

    & .back {
      position: absolute;
      inset: 0;
      display: grid;
      place-content: center;
      backface-visibility: hidden;
      rotate: y 180deg;
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

  .timer {
    transition: color 0.3 ease;
  }
  .pulse {
    color: var(--pulse);
    animation: pulse 1s infinite ease;
  }

  @keyframes pulse {
    to {
      scale: 1.4;
    }
  }
</style>

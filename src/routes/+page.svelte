<script lang="ts">
  import { emoji } from '$lib/emoji'

  type State = 'init' | 'playing' | 'paused' | 'won' | 'lost'

  let state: State = 'init'
  let size: number = 20
  let grid = createGrid()

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

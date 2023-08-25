import { writable } from 'svelte/store'

export function useMachine(machine, initial) {
  const state = writable(initial)

  function send(event) {
    state.update((state) => machine(state, event))
  }

  return { state, send }
}

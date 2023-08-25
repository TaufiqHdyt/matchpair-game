import { writable } from 'svelte/store'

interface StartEvent {
  type: 'START'
}

interface EscapeEvent {
  type: 'ESCAPE'
}

interface TickEvent {
  type: 'TICK'
  data: number
}

interface ClickEvent {
  type: 'CLICK'
  data: number
}

export type State = 'waiting' | 'playing' | 'paused' | 'gameover'

export type Event = StartEvent | EscapeEvent | TickEvent | ClickEvent

export type Machine = (state: State, event: Event) => State

export function useMachine(machine: Machine, initial: State) {
  const state = writable<State>(initial)

  function send(event: Event) {
    state.update((state) => machine(state, event))
  }

  return { state, send }
}

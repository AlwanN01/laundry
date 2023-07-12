import { produce, type Draft, type Immutable } from "immer"
import { create, type StoreApi, type UseBoundStore } from "zustand"
import { combine, devtools, subscribeWithSelector } from "zustand/middleware"
import { immer } from "zustand/middleware/immer"

export type SetState<State> = (
  nextStateOrUpdater: State | Partial<State> | ((state: Draft<State>) => void),
  shouldReplace?: boolean | undefined,
  action?: string | { type: unknown } | undefined
) => void
export type HandlerStore<State, Method> = (set: SetState<State>, get: () => State) => Method
export type ReducerStore<State, Action> = (
  state: State,
  action: Action,
  set: SetState<State>,
  get: () => State
) => Promise<void> | void
type Options = {
  nameStore?: string
  devtools?: boolean
  isLogging?: boolean
}

export function createStore<
  State extends object,
  Method extends Record<string, (...props: any) => any>,
  Action extends {
    type: String | keyof DefaultSetState<State>
    payload?: unknown
    [key: string]: unknown
  }
>(
  initState: State,
  handler?: HandlerStore<State, Method> | null,
  reducerOrOptions: ReducerStore<State, Action> | Options = {},
  options: Options = {}
) {
  handler = handler || (() => ({} as Method))
  const {
    nameStore = "Store",
    isLogging = false,
    devtools: _devtools = true,
  } = (isOptions(reducerOrOptions) && reducerOrOptions) || options
  const immerReducer =
    (reducerOrOptions && !isOptions(reducerOrOptions) && produce(reducerOrOptions)) ||
    (async () => ({}))
  return createSelectors(
    create(
      subscribeWithSelector(
        devtools(
          immer(
            combine(initState, (set, get) => {
              const setWithLogging = (nextStateOrUpdater: Parameters<typeof set>[0]) => {
                const key = Object.keys(nextStateOrUpdater)
                const values = Object.values(nextStateOrUpdater)
                set(nextStateOrUpdater, false, {
                  type:
                    key.length == 1
                      ? `set${key[0]!.charAt(0).toUpperCase() + key[0]!.slice(1)} to ${values[0]}`
                      : typeof nextStateOrUpdater == "function"
                      ? `set: ${extractString(nextStateOrUpdater.toString())}`
                      : `set: ${key.join(" | ")}`,
                })
              }
              return {
                dispatch: async (action: Action) => {
                  isLogging && console.log("prev State", get())
                  set(
                    reducerOrOptions
                      ? await immerReducer!(get() as unknown as Immutable<State>, action, set, get)
                      : (state) => state,
                    false,
                    action
                  )
                  isLogging && console.log("new State", get())
                },
                set: setWithLogging,
                get,
                ...defaultSetState<State, keyof Method>(initState, set, get),
                ...handler!(setWithLogging, get),
              }
            })
          ),
          {
            name:
              nameStore === "Store"
                ? `Store: ${Object.keys(initState).slice(0, 3).join(" | ")} ${
                    Object.keys(initState).length > 3 ? "| ..." : ""
                  }`
                : nameStore,
            enabled: _devtools && (process.env.NODE_ENV == "production" ? false : undefined),
            maxAge: 10,
            stateSanitizer: (state) => {
              for (const key in state) {
                if (state[key] instanceof Element) {
                  return {
                    ...state,
                    [key]: `<<_NODE_ELEMENT_${(state[key] as HTMLElement).nodeName}_>>`,
                  }
                }
              }
              return state
            },
          }
        )
      )
    )
  )
}
function isOptions(variable: any): variable is Options {
  return Object.prototype.toString.call(variable) === "[object Object]"
}
type WithSelectors<S> = S extends { getState: () => infer T }
  ? S & {
      use: <K extends Array<keyof T>>(...args: K) => { [Key in K[number]]: T[Key] }
      useFunction: () => {
        [K in keyof T as T[K] extends Function ? K : never]: T[K]
      }
    }
  : never
function createSelectors<S extends UseBoundStore<StoreApi<object>>>(_store: S) {
  let store = _store as WithSelectors<typeof _store>
  store.use = (...key: string[]) => {
    let selectedStore: Record<string, any> = {}
    for (let k of key) {
      selectedStore[k] = store((s) => s[k as keyof typeof s])
    }
    return selectedStore
  }
  store.useFunction = () => {
    let selectedStore: Record<string, any> = {}
    const getStore = store.getState()
    for (let k in getStore) {
      if (typeof (getStore as any)[k] == "function")
        selectedStore[k] = store((s) => s[k as keyof typeof s])
    }
    return selectedStore
  }
  return store
}

type DefaultSetState<T> = {
  [K in keyof T as `set${Capitalize<string & K>}`]: (
    state: T[K] | ((prevState: T[K]) => T[K] | Promise<T[K]>)
  ) => void | Promise<void>
}

function defaultSetState<T extends object, M>(initstate: T, set: any, get: any) {
  let $defaultSetState = {} as Record<string, (value: any) => void>
  for (const key in initstate) {
    if (Object.prototype.hasOwnProperty.call(initstate, key)) {
      const keyName = key.charAt(0).toUpperCase() + key.slice(1)
      $defaultSetState[`set${keyName}`] = async (valueOrCallback: any) => {
        const value =
          typeof valueOrCallback == "function" ? await valueOrCallback(get()[key]) : valueOrCallback
        set({ [key]: value }, false, {
          type: `set${keyName} to ${JSON.stringify(value)}`,
        })
      }
    }
  }
  return $defaultSetState as DefaultSetState<T>
}

function extractString(str: string) {
  const regex = /state\.(.*?)\s*\=\s*(.*)/g
  let matches = []
  let match
  while ((match = regex.exec(str))) {
    matches.push(match[1])
  }
  return matches.join(" | ")
}

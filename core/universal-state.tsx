import { useContext, useEffect, useRef } from 'react'

import {
  observable,
  makeAutoObservable,
  configure,
  reaction,
  when as _when,
  computed as _computed
} from 'mobx'

import {
  enableStaticRendering,
  MobXProviderContext,
  useLocalObservable
} from 'mobx-react'

/**
 * Enable SSR if it is running on the server.
 */
enableStaticRendering(typeof window === 'undefined')

/**
 * Allow use of loose action.
 */
configure({ enforceActions: 'never' })

/**
 * Collects instances of the store instances of the store.
 */
let storeInstancesForCSR: any = null

export type UniversalBindType = 'normal' | 'noWrap' | 'unset'

/**
 * Wrap the Observer box storage class instance.
 */
const convertToObservableBox = <T extends { new (): InstanceType<T> }>(
  StoreClass: T
) => {
  const instance = new StoreClass()
  const overrideOptions = {}
  const instanceKeys = Object.keys(instance)

  let bindOption = 'normal' as UniversalBindType
  if (typeof instance['__bindOption'] === 'string') {
    bindOption = instance['__bindOption'] as UniversalBindType
  }

  if (bindOption === 'normal') {
    // If a variable or function name starts with __, it will not convert it.
    const ignoreVariables = instanceKeys.filter((value) => {
      return value.startsWith('__') || value === 'store'
    })

    for (const ignoreVariable of ignoreVariables)
      overrideOptions[ignoreVariable] = false
  } else if (bindOption === 'noWrap') {
    for (const instanceKey of instanceKeys) overrideOptions[instanceKey] = false
  }
  makeAutoObservable(instance, overrideOptions)

  const observableWrap = observable.box<T>()
  observableWrap.set(instance as T)
  return observableWrap.get() as InstanceType<T>
}

export type StoreType<
  T extends { [storeName in string]: { new (): InstanceType<T[storeName]> } }
> = {
  [storeName in keyof T]: InstanceType<T[storeName]>
}

/**
 * Receive class instances of the stores
 * and wrap them in the Mobx Observer box.
 */
const defineStores = <
  T extends { [storeName in string]: { new (): InstanceType<T[storeName]> } }
>(
  stores: T
): {
  [storeName in keyof T]: InstanceType<T[storeName]>
} => {
  const bindedStores: StoreType<T> = {} as StoreType<T>

  // Create a store instance.
  for (const storeName in stores) {
    const bindedStore = convertToObservableBox(stores[storeName])
    bindedStores[storeName] = bindedStore
  }

  // Share store instances among store instances.
  for (const bindedStore of Object.values(bindedStores))
    bindedStore.store = bindedStores

  return bindedStores
}

/**
 * Provides a state store within the context of a react.
 */
export const StoreProvider = (context: any) => {
  const {
    /**
     * Children React Node.
     */
    children,
    /**
     * The pure json data given to clients via SSR.
     */
    ssr,
    /**
     * Class of Stores.
     */
    structure
  } = context

  if (process.browser) {
    if (storeInstancesForCSR === null) {
      storeInstancesForCSR = defineStores(structure)

      if (typeof ssr === 'object') {
        if (ssr !== undefined) {
          for (const storeName in storeInstancesForCSR) {
            if (typeof ssr[storeName] !== 'undefined') {
              for (const propertyName in storeInstancesForCSR[storeName]) {
                if (typeof ssr[storeName][propertyName] !== 'undefined') {
                  // If it is an empty object, it will not render SSR.
                  if (
                    propertyName !== 'store' &&
                    ssr[storeName][propertyName] &&
                    typeof ssr[storeName][propertyName] === 'object' &&
                    Object.keys(ssr[storeName][propertyName]).length === 0
                  )
                    continue
                  storeInstancesForCSR[storeName][propertyName] =
                    ssr[storeName][propertyName]
                }
              }
            }
          }
        }
      }
    }

    for (const bindedStoreName of Object.keys(storeInstancesForCSR))
      storeInstancesForCSR[bindedStoreName].store = storeInstancesForCSR

    return (
      <MobXProviderContext.Provider value={storeInstancesForCSR}>
        {children}
      </MobXProviderContext.Provider>
    )
  } else {
    // Create the store only when React Lifecycle is newly created.
    const stores = useRef(null as any)

    // Client always creates a new instance of the state store.
    if (stores.current === null) stores.current = defineStores(structure)

    if (typeof ssr === 'object') {
      // Injects pure json data (SSR processed)
      // into each store instance.
      for (const storeName in stores.current) {
        if (typeof ssr[storeName] !== 'undefined') {
          for (const propertyName in stores.current[storeName]) {
            if (typeof ssr[storeName][propertyName] !== 'undefined') {
              // If it is an empty object, it will not render SSR.
              if (
                propertyName !== 'store' &&
                ssr[storeName][propertyName] &&
                typeof ssr[storeName][propertyName] === 'object' &&
                Object.keys(ssr[storeName][propertyName]).length === 0
              )
                continue
              stores.current[storeName][propertyName] =
                ssr[storeName][propertyName]
            }
          }
        }
      }
    }

    return (
      <MobXProviderContext.Provider value={stores.current}>
        {children}
      </MobXProviderContext.Provider>
    )
  }
}

/**
 * Type information about the converted state stores.
 */
type IStore<
  T extends { [storeName in string]: { new (): InstanceType<T[storeName]> } }
> = { [storeName in keyof T]: InstanceType<T[storeName]> }

/**
 * Returns a state store available within a component.
 */
export const useStore = <
  T extends { [storeName in string]: { new (): InstanceType<T[storeName]> } }
>(): IStore<T> => {
  if (process.browser) return storeInstancesForCSR

  const store = useContext(MobXProviderContext)
  if (!store)
    throw new Error(
      `Invalid context access. useStore cannot be called from the server.\n` +
        `If you are using getInitialProps and onPrefetch, Use context.store to access.`
    )
  return store as IStore<T>
}

/**
 * Create simple local state.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const state = <T, _>(data: T) => {
  try {
    return useLocalObservable(() => observable(data))
  } catch (error) {
    return observable(data)
  }
}

/**
 * Create simple local computed value.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const computed = <T, _>(data: () => T) => {
  try {
    return useLocalObservable(() => _computed(data)).get()
  } catch (error) {
    return _computed(data).get()
  }
}

const _watch = <T, B>(
  source: () => T,
  callback: (deps: T) => B,
  options: { immediate: boolean } = {
    immediate: false
  }
) => {
  let unsubscribe: B
  if (options && options.immediate) unsubscribe = callback(source())
  const cleanupReaction = reaction<T>(source, (args) => {
    if (typeof unsubscribe === 'function') unsubscribe()
    unsubscribe = callback(args)
  })

  return () => cleanupReaction()
}

/**
 * @description
 * Detects changes of state value.
 * 
 * @example
 * watch(
    () => Counter.count,
    changedValue => {
      console.log(`👀 changedValue:`, changedValue)
    }
  )
 * @param source Observable object to detect
 * @param callback `changedValue => {}` Changed Value
 * @param options Watch Options
 */
export const watch = <T, B>(
  source: () => T,
  callback: (deps: T) => B,
  options: { immediate: boolean } = {
    immediate: false
  }
) => {
  try {
    // Check whether it is being called within React Hooks.
    const store = useContext(MobXProviderContext)
    if (!store) throw new Error('Not found StoreProvider')
    useEffect(() => {
      return _watch(source, callback, options)
    }, [])
  } catch (e) {
    _watch(source, callback, options)
  }
}

/**
 * @description
 * 'when' function allows logic to be
 * used when certain conditions are reached.
 * 
 * @example
 * async function() {
    await when(() => that.isVisible)
    // etc ..
  }
 */
export const when = _when

/**
 * Global Prefetchers
 */
const _globalPrefetchers: ((appContext: any) => void | Promise<void>)[] = []

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const onPrefetch = <T, _ = void>(
  callback: (appContext: T) => void | Promise<void>,
  component?: any
) => {
  if (component) component.onPrefetch = callback
  else _globalPrefetchers.push(callback)
}

/**
 * Global Server Prefetchers
 */
const _globalServerPrefetchers: ((
  appContext: any
) => void | Promise<void>)[] = []

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const onServerPrefetch = <T, _ = void>(
  callback: (appContext: T) => void | Promise<void>,
  component?: any
) => {
  if (component) component.onServerPrefetch = callback
  else _globalServerPrefetchers.push(callback)
}

/**
 * Global Client Prefetchers
 */
const _globalClientPrefetchers: (() => void | Promise<void>)[] = []

/**
 * This function runs only once before rendering occurs on the client.
 */
export const onClientPrefetch = (callback: () => void | Promise<void>) => {
  _globalClientPrefetchers.push(callback)
}

/**
 * Function for performing SSR from next to store.
 */
export const useSSR = async <
  ContextType extends { Component; ctx },
  IStores extends {
    [storeName in string]: { new (): InstanceType<IStores[storeName]> }
  }
>(
  appContext: ContextType,
  Stores: IStores
) => {
  /**
   * Create Server Side Rendered stores data.
   */
  const stores = process.browser ? storeInstancesForCSR : defineStores(Stores)

  // Inject the store into the page context.
  appContext.ctx.store = stores

  if (typeof window === 'undefined') {
    // Run Server Prefetcher
    for (const globalServerPrefetcher of _globalServerPrefetchers)
      await globalServerPrefetcher(appContext)

    // Run Page Server Prefetcher
    const pageServerPrefetcher = (appContext.Component as any).onServerPrefetch
    if (typeof pageServerPrefetcher !== 'undefined')
      await pageServerPrefetcher(appContext)
  }

  // Run Global Prefetcher
  for (const globalPrefetcher of _globalPrefetchers)
    await globalPrefetcher(appContext)

  // Run Page Global Prefetcher
  const pagePrefetcher = (appContext.Component as any).onPrefetch
  if (typeof pagePrefetcher !== 'undefined') await pagePrefetcher(appContext)

  return stores
}

/**
 * Prevent Circular structure in JSON.
 * @param stateJSON
 */
export const makeStateJSON = (stateJSON) => {
  for (const storeName in stateJSON) {
    for (const propertyName in stateJSON[storeName]) {
      if (propertyName === 'store') delete stateJSON[storeName][propertyName]
      else if (typeof stateJSON[storeName][propertyName] === 'function')
        delete stateJSON[storeName][propertyName]
    }
  }
  return stateJSON
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const cloneStore = <T, _ = void>(store: T) => {
  const clonedStore = {} as any
  for (const propertyName of Object.keys(store)) {
    if (propertyName === 'store') continue
    clonedStore[propertyName] = store[propertyName]
  }
  return JSON.parse(JSON.stringify(clonedStore)) as T
}

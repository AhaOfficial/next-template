import _dynamic from 'next/dynamic'

/**
 * JSX 컴포넌트를 비동기로 임포트 해옵니다.
 *
 * @param componentImport 컴포넌트를 임포트하는 콜백이 주어져야합니다.
 * @param loadingComponent 비동기 임포트가 완료되기 전 보여질 컴포넌트입니다.
 *
 * @example
 * // 비동기 임포트 예시
 * const App = dynamic(async () => (await import('sendbird-uikit')).App)
 * // 동기 임포트 예시
 * const App = dynamic(() => import('./FileUpload')))
 */
export const dynamic = <T extends () => any>(
  componentImport: T,
  loadingComponent?: ({
    error,
    isLoading,
    pastDelay
  }: {
    error?: Error | null | undefined
    isLoading?: boolean | undefined
    pastDelay?: boolean | undefined
    retry?: (() => void) | undefined
    timedOut?: boolean | undefined
  }) => JSX.Element
) => {
  return _dynamic(componentImport, {
    ssr: true,
    loading: loadingComponent
      ? loadingComponent
      : function Loading() {
          return <></>
        }
  }) as Await<ReturnType<T>>
}

/**
 * JSX 컴포넌트를 비동기로 임포트 해온 뒤
 * CSR 로만 렌더링 가능하도록 하는 코드입니다.
 *
 * @param componentImport 컴포넌트를 임포트하는 콜백이 주어져야합니다.
 * @param loadingComponent 비동기 임포트가 완료되기 전 보여질 컴포넌트입니다.
 *
 * @example
 * // 비동기 임포트 예시
 * const App = dynamicCSR(async () => (await import('sendbird-uikit')).App)
 * // 동기 임포트 예시
 * const App = dynamicCSR(() => import('./FileUpload')))
 */
export const dynamicCSR = <T extends () => any>(
  componentImport: T,
  loadingComponent?: ({
    error,
    isLoading,
    pastDelay
  }: {
    error?: Error | null | undefined
    isLoading?: boolean | undefined
    pastDelay?: boolean | undefined
    retry?: (() => void) | undefined
    timedOut?: boolean | undefined
  }) => JSX.Element
) => {
  return _dynamic(componentImport, {
    ssr: false,
    loading: loadingComponent
      ? loadingComponent
      : function Loading() {
          return <></>
        }
  }) as Await<ReturnType<T>>
}

/**
 * Await 처리 된 타입을 가져오는 헬퍼 타입입니다.
 */
export type Await<T> = T extends {
  then(onfulfilled?: (value: infer U) => unknown): unknown
}
  ? U
  : T

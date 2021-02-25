import { StoreType } from 'core/universal-state'
import { NextPageContext } from 'next'
import { AppContext } from 'next/app'
import Stores from 'stores'

/**
 * * 외부에서 참조 가능한 스토어 타입정보입니다.
 */
export type ServiceStore = StoreType<typeof Stores>

/**
 * * 서비스 페이지에 주어지는 컨텍스트 타입입니다.
 */
export type ServicePageContext = NextPageContext & {
  /**
   * 요청마다 개별적으로 생성되는
   * 상태 저장소 인스턴스입니다.
   */
  store: ServiceStore
}

/**
 * * 서비스 컨텍스트 타입입니다.
 */
export type ServiceContext = AppContext & {
  ctx: ServicePageContext
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IUser {}

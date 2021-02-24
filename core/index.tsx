import { state, useStore } from 'core/universal-state'
import type Stores from 'stores'

/**
 * * 핵심적으로 사용되는 로직들이 담깁니다.
 */
class Core {
  /**
   * * 상태 저장소에 접근합니다.
   */
  get store() {
    return useStore<typeof Stores>()
  }

  /**
   * * 사용하기 편한 내부 상태를 만듭니다.
   */
  state = state
}

export const core = new Core()

import { ServiceStore } from 'interfaces/service'

/**
 * 간단한 카운터 상태 저장소 예시입니다.
 */
export class Counter {
  protected store!: ServiceStore

  /**
   * 계측된 숫자
   */
  count = 0

  /**
   * 계측된 숫자를 상승시킵니다.
   */
  up() {
    this.count++
  }
  /**
   * 계측된 숫자를 하락시킵니다.
   */
  down() {
    this.count--
  }
}

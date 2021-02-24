import type { AxiosInstance } from 'axios'
import { ServiceStore } from 'interfaces/service'
import type Service from 'stores/service'

/**
 * * 서브 서비스 개발시 사용되는 클래스입니다.
 */
export class SubService {
  protected backEnd: AxiosInstance
  protected store: ServiceStore

  constructor(service: Service) {
    this.backEnd = service.__backEnd
    this.store = service.store
  }
}

import { createAxiosInstance } from 'core/axiosHelper'
import { ServiceStore } from 'interfaces/service'
import User from './user'
import { parseCookies } from 'nookies'

/**
 * * 서비스 상태 저장소입니다.
 */
class Service {
  store!: ServiceStore

  /**
   * axios 백엔드 인스턴스입니다.
   * ? 변수 앞에 __가 붙으면 MobX 상태 값으로 래핑되지 않습니다.
   */
  __backEnd = createAxiosInstance(
    process.env.apiUrl || 'http://localhost:13001'
  )

  constructor() {
    if (process.browser) {
      // 이용자의 쿠키 정보를 분석합니다.
      const { token } = parseCookies(null)
      // 토큰 정보가 있으면 이를 적용합니다.
      if (token) this.setToken(token)
    }
  }

  /**
   * 토큰을 설정합니다.
   * @param accessToken
   */
  setToken(accessToken) {
    if (accessToken) {
      this.__backEnd.defaults.headers.common.Authorization = `Bearer ${accessToken}`
    } else {
      this.__backEnd.defaults.headers.common.Authorization = null
    }
  }

  // 아래에서 서브 서비스 초기화가 진행됩니다.
  User = new User(this)
}

export default Service

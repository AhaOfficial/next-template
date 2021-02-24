// * 스토어 클래스를 임포트합니다.
import { onPrefetch } from 'core/universal-state'
import { ServiceContext } from 'interfaces/service'
import { parseCookies } from 'nookies'
import { Auth } from './auth'
import { Counter } from './counter'
import { Todo } from './todo'
import Service from './service'

/**
 * * 스토어 클래스들을 여기에 넣습니다.
 * * 여기에는 반드시 스토어 클래스만을 넣어야합니다.
 */
const Stores = {
  Auth,
  Service,
  Counter,
  Todo
}
export default Stores

/**
 * * 서버와 클라이언트 요청 초기에 실행됩니다
 */
onPrefetch<ServiceContext>(async ({ ctx }) => {
  // 사전 데이터 패치 로직이 담깁니다.
  const { Service } = ctx.store

  // 토큰이 존재하는 경우 이를 설정합니다.
  const { token } = parseCookies(process.browser ? null : ctx)
  if (token) Service.setToken(token)
})

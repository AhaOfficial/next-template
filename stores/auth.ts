import { IMyInfo, ServiceStore } from 'interfaces/service'

export class Auth {
  private store!: ServiceStore

  session = false
  user: IMyInfo | null = null

  /**
   * 이용자 정보를 획득합니다.
   */
  get authUser() {
    return this.user
  }

  /**
   * * 로그인한 사용자 정보를 불러옵니다.
   */
  async fetchAuthUser() {
    const { Service } = this.store
    const { data } = await Service.User.getMyInfo()
    this.user = data
  }
}

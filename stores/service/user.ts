import { SubService } from 'stores/service/utils'

class User extends SubService {
  getMyInfo() {
    return this.backEnd.get('/users/me')
  }
}

export default User

/**
 * * 할일의 규격 선언
 */
export interface ITodoItem {
  /**
   * * 할 일의 순서번호
   */
  id: number
  /**
   * * 할일의 제목
   */
  title: string
  /**
   * * 완료 여부
   */
  done: boolean
}

export class Todo {
  /**
   * * 할일 목록
   */
  todoList: ITodoItem[] = [
    {
      id: 0,
      title: '다람쥐 땅콩 주기',
      done: false
    },
    {
      id: 1,
      title: '고양이 츄르 주기',
      done: false
    },
    {
      id: 4,
      title: '넥스트 예시 만들기',
      done: true
    }
  ]
  /**
   * * 새로 제목을 입력하는 중인 할일
   */
  newTodo = ''
  /**
   * * 완료된 할 일을 보여줄지 여부
   */
  showComplete = false

  /**
   * * 진행 중인 작업 목록
   */
  get pending() {
    return this.todoList.filter((item) => !item.done)
  }

  /**
   * * 완료된 작업 목록
   */
  get completed() {
    return this.todoList.filter((item) => item.done)
  }

  /**
   * * 완료 퍼센트
   */
  get completedPercentage() {
    const percent = Math.floor(this.completed.length / this.todoList.length)
    return percent ? percent : 0 + '%'
  }

  /**
   * * 오늘 요일 얻어오기
   */
  get today() {
    const weekday = [
      '일요일',
      '월요일',
      '화요일',
      '수요일',
      '목요일',
      '금요일',
      '토요일'
    ]
    const today: any = new Date()
    let dd = today.getDate()
    let mm = today.getMonth() + 1
    const yyyy = today.getFullYear()

    if (dd < 10) dd = '0' + dd
    if (mm < 10) mm = '0' + mm

    const dayObject: {
      /**
       * * 요일을 문자열로 반환합니다.
       */
      day: string

      /**
       * * 날짜를 YYYY-MM-DD 형태의 문자열로 반환합니다.
       */
      date: string
    } = {
      day: weekday[today.getDay()],
      date: yyyy + '-' + mm + '-' + dd
    }
    return dayObject
  }

  /**
   * * 할 일 목록을 로컬 스토리지에서 가져옵니다.
   */
  getTodos() {
    try {
      if (
        typeof window !== 'undefined' &&
        window.localStorage.getItem('todo_list')
      ) {
        this.todoList = JSON.parse(
          window.localStorage.getItem('todo_list') as string
        )
      }
    } catch (e) {}
  }

  /**
   * * 하려는 일을 목록에 추가합니다.
   */
  addItem() {
    // * 하려는 일의 제목이 작성되어 있는 경우만
    if (this.newTodo) {
      this.todoList.unshift({
        id: this.todoList.length,
        title: this.newTodo,
        done: false
      })
    }

    // * 하려는 일의 제목을 초기화합니다.
    this.newTodo = ''
    return true
  }

  /**
   * * 해당 아이템을 목록에서 삭제합니다.
   */
  deleteItem(item: ITodoItem) {
    this.todoList.splice(this.todoList.indexOf(item), 1)
  }

  /**
   * * 완료한 일 목록을 보여줄지 말지를 토글합니다.
   */
  toggleShowComplete = () => {
    this.showComplete = !this.showComplete
  }

  /**
   * * 모든 할일 목록을 초기화합니다.
   */
  clearAll = () => {
    this.todoList = []
  }
}

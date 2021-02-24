import { core } from 'core'
import style from './index.scss'
import classnames from 'classnames'

const TodoPage = () => {
  const { Todo } = core.store

  return (
    <div className="homePage">
      <div className="background">
        <section className="todo-wrapper">
          {/* 제목  */}
          <h1 className="todo-title">
            할 일 목록
            <br />
            {Todo.today.date} {Todo.today.day}
          </h1>

          {/* <!-- 입력폼  --> */}
          <form
            onKeyDown={(e) => {
              if (e.key === 'Enter') e.preventDefault()
            }}
          >
            <input
              type="text"
              value={Todo.newTodo}
              className={`${classnames('input-todo', {
                active: Todo.newTodo
              })}`}
              onChange={(e) => (Todo.newTodo = e.target.value)}
              onKeyUp={(e) => {
                if (e.key === 'Enter') Todo.addItem()
              }}
              placeholder="할 일을 여기 적고 +를 누릅니다."
            />
            <div
              className={`${classnames('btn btn-add', {
                active: Todo.newTodo
              })}`}
              onClick={() => Todo.addItem()}
            >
              +
            </div>
          </form>

          {/* <!-- 할 일 목록  --> */}
          {Todo.pending.length > 0 && (
            <div>
              <p className="status busy">
                현재 할 일이 {Todo.pending.length}가지 있습니다.
                {Todo.pending.length > 1 && <span />}
              </p>
              <ul className="todo-list">
                {Todo.pending.map((item) => {
                  return (
                    <li key={item.title}>
                      <input
                        id={`item_${item.id}`}
                        value={String(item.done)}
                        onChange={(e) => (item.done = e.target.checked)}
                        className="todo-checkbox"
                        type="checkbox"
                      />
                      <label htmlFor={'item_' + item.id}></label>
                      <span className="todo-text">{item.title}</span>
                      <span
                        className="delete"
                        onClick={() => Todo.deleteItem(item)}
                      ></span>
                    </li>
                  )
                })}
              </ul>
            </div>
          )}

          {/* // <!-- 할 일이 없을 때 --> */}
          <div>
            {!Todo.pending.length && (
              <p className="status free">
                <img
                  src="https://nourabusoud.github.io/vue-todo-list/images/beer_celebration.svg"
                  alt="celebration"
                />
                모든 일을 다 마치셨습니다! 😊
              </p>
            )}
          </div>

          {/* <!-- 완료한 사항 목록 --> */}
          {Todo.todoList.length > 0 &&
            Todo.completed.length > 0 &&
            Todo.showComplete && (
              <div>
                <p className="status">
                  완료된 사항: {Todo.completedPercentage}
                </p>
                <ul className="todo-list archived">
                  {Todo.completed.map((item) => {
                    return (
                      <li key={item.title}>
                        <input
                          type="checkbox"
                          className="todo-checkbox"
                          value={String(item.done)}
                          onChange={(e) => (item.done = e.target.checked)}
                        />
                        <label htmlFor={'item_' + item.id}></label>
                        <span className="todo-text">{item.title}</span>
                        <span
                          className="delete"
                          onClick={() => Todo.deleteItem(item)}
                        ></span>
                      </li>
                    )
                  })}
                </ul>
              </div>
            )}

          {/* 할 일 목록 제어 버튼 */}
          <div className="control-buttons">
            {Todo.completed.length > 0 && (
              <div
                className="btn btn-secondary"
                onClick={() => Todo.toggleShowComplete()}
              >
                {!Todo.showComplete ? (
                  <span>완료한 사항 보이기</span>
                ) : (
                  <span>완료한 사항 감추기</span>
                )}
              </div>
            )}

            {Todo.todoList.length > 0 && (
              <div
                className="btn btn-secondary"
                onClick={() => Todo.clearAll()}
              >
                알림 다 지우기
              </div>
            )}
          </div>
        </section>
      </div>

      {/* SCSS 스타일을 페이지에 주입합니다. */}
      <style jsx>{style}</style>
    </div>
  )
}

export default TodoPage

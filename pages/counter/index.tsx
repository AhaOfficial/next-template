import { core } from 'core'
import style from './index.scss'

const CounterPage = () => {
  const { Counter } = core.store
  return (
    <div className="counterPage">
      <div className="counter">
        {/* 제목 */}
        <h1 className="title">😊&nbsp;&nbsp;간단한 카운터: {Counter.count}</h1>

        {/* - 버튼 */}
        <button className="controlButton" onClick={() => Counter.down()}>
          -
        </button>

        {/* 중간 입력칸 */}
        <input
          value={Counter.count}
          onChange={(e) => (Counter.count = Number(e.target.value))}
          className="controlInput"
        />

        {/* + 버튼 */}
        <button className="controlButton" onClick={() => Counter.up()}>
          +
        </button>
      </div>

      {/* SCSS 스타일을 페이지에 주입합니다. */}
      <style jsx>{style}</style>
    </div>
  )
}

export default CounterPage

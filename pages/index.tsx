import NextLink from 'components/atomics/NextLink'
import { ServicePageContext } from 'interfaces/service'
import style from './index.scss'

const HomePage = () => {
  /**
   * 예시 항목에 작성되어야하는 필수 정보입니다.
   */
  interface IExampleItem {
    /**
     * 예시 항목의 이모지입니다.
     */
    emoji: string
    /**
     * 예시 항목의 제목입니다.
     */
    title: string
    /**
     * 예시 항목에 대한 짧은 설명입니다.
     */
    infoShort: string
    /**
     * 예시 항목을 볼 수 있는 페이지 주소입니다.
     */
    link: string
  }
  const list: IExampleItem[] = [
    {
      emoji: '🎚',
      title: '카운터',
      infoShort: 'vue-state-store 의 기본 예시입니다.',
      link: '/counter'
    },
    {
      emoji: '📝',
      title: '할 일 목록',
      infoShort: 'TODO 리스트 예시입니다.',
      link: '/todo'
    }
  ]
  return (
    <div className="homePage">
      {/* 인덱스 페이지 설명 */}
      <div className="form">
        <span className="pr-3"> 🎉 </span>
        <span className="info-block">
          넉스트 템플릿의 예시 페이지들이 아래 나열됩니다.
        </span>
      </div>

      {/* 이동가능한 예시 페이지 목록 */}
      {list.map((item) => {
        return (
          <div key="item.title">
            <NextLink href={item.link}>
              <div className="form">
                {/* 주 내용이 담기는 넓은 레이아웃 */}
                <div className="w-9/12">
                  <span className="pr-2">{item.emoji}</span>
                  <span className="title">{item.title}</span>
                  <span className="info-short">
                    &nbsp;-&nbsp;{item.infoShort}
                  </span>
                </div>
                {/* 주소용 좁은 레이아웃 */}
                <div className="w-3/12 text-right">
                  <span className="info-link">{item.link}</span>
                </div>
              </div>
            </NextLink>
          </div>
        )
      })}

      {/* SCSS 스타일을 페이지에 주입합니다. */}
      <style jsx>{style}</style>
    </div>
  )
}

HomePage.getInitialProps = async (context: ServicePageContext) => {
  const { Auth } = context.store
  try {
    await Auth.fetchAuthUser()
  } catch (e) {}

  return { query: context.query }
}

export default HomePage

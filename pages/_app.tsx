// * 모듈들을 불러옵니다.
import React from 'react'
import { NextComponentType } from 'next'
import NextApp, { AppContext, AppInitialProps, AppProps } from 'next/app'
import Head from 'next/head'
import { DefaultSeo } from 'next-seo'
import { observer } from 'mobx-react'

// * 서비스 관련 파일들을 불러옵니다.
import Stores from 'stores'
import { StoreProvider, useSSR } from 'core/universal-state'
import LayoutDefault from 'components/layouts/Default'
import Favicon from 'components/head/Favicon'
import nextSeoConfig from 'next-seo.config'

// * 글로벌 스타일들을 불러옵니다.
import tailwindStyle from '../assets/scss/tailwind.scss'

/**
 * * 모든 페이지의 초기화가 여기에서 진행됩니다.
 */
const App: NextComponentType<
  AppContext,
  AppInitialProps,
  AppProps & {
    /**
     * 스토어 데이터가 SSR 처리 되어
     * 순수한 JSON 형태로 클라이언트에 전달됩니다.
     */
    stateJSON: any
  }
> = ({ Component, pageProps, stateJSON }) => {
  /**
   * Head 에 주입되는 페이지 설정입니다.
   */
  const pageConfigs = [
    { id: 'config-1', name: 'http-equiv', content: 'autoRotate:disabled' },
    {
      id: 'config-2',
      name: 'viewport',
      content:
        'width=device-width, initial-scale=1, maximum-scale=1.0, user-scalable=0, viewport-fit=cover'
    }
  ]

  return (
    <>
      {/* Head 에 메타정보를 주입합니다. */}
      <Head>
        <Favicon />
        {pageConfigs.map((config) => (
          <meta key={config.id} {...config} />
        ))}
      </Head>

      {/* SEO 용 메타정보를 추가로 주입합니다. */}
      <DefaultSeo {...nextSeoConfig} />

      {/* 글로벌 스타일들을 페이지에 적용합니다. */}
      <style jsx global>
        {tailwindStyle}
      </style>

      {/* 페이지 기본 구조를 구성합니다. */}
      <StoreProvider ssr={stateJSON} structure={Stores}>
        {<Page {...{ Component, pageProps }} />}
      </StoreProvider>
    </>
  )
}

/**
 * * 페이지 최상단에 적용되어야하는
 * * 컴포넌트들의 순서가 여기에서 정의됩니다.
 */
const Page = observer(({ Component, pageProps }) => {
  /**
   * 페이지의 라우팅 가드를 앱에 적용합니다.
   */
  const Guard = (Component as any).guard || React.Fragment

  /**
   * 기본 레이아웃 또는 페이지 레이아웃을 적용합니다.
   */
  const Layout = (Component as any).layout || LayoutDefault

  /**
   * 페이지의 서브 레이아웃을 적용합니다.
   */
  const SubLayout = (Component as any).subLayout || React.Fragment

  /**
   * 페이지에 스토어를 바인딩한 후 렌더링합니다.
   */
  const BoundPage = observer(Component)

  return (
    <Guard>
      <Layout>
        <SubLayout>
          <BoundPage {...pageProps} />
        </SubLayout>
      </Layout>
    </Guard>
  )
})

/**
 * * 서비스 내 사전 요청을 재정의합니다.
 */
App.getInitialProps = async (context) => {
  // 매 서버 요청마다 상태 저장소 정보를 별도로 구성합니다.
  const stateJSON = await useSSR(context, Stores)

  // 기존 getInitialProps 를 실행합니다.
  const appProps = await NextApp.getInitialProps(context)

  return { ...appProps, stateJSON } as AppInitialProps
}

export default App

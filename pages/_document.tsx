import Document, { Html, Head, Main, NextScript } from 'next/document'

/**
 * * 앱에서 재정의한 기본 문서 규격입니다.
 */
class AppDocument extends Document {
  /**
   * * getInitialProps 을 재정의 하는 함수입니다.
   * @param ctx
   */
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  render() {
    return (
      <Html>
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default AppDocument

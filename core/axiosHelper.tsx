import axios, { AxiosInstance } from 'axios'
import util from 'util'

/**
 * * axios 인스턴스를 생성합니다.
 * @param baseURL
 */
export const createAxiosInstance = (baseURL: string) => {
  const instance = axios.create({
    // * 요청을 전송할 서버를 구성합니다.
    baseURL
  })

  /**
   * * 백엔드에 요청을 바로 보낼 수 있는 래핑 함수 입니다.
   */
  // * Axios 사용시 추천되는 기본 옵션들을 설치합니다.
  installDefaults(instance)

  // * 브라우저에서 작동 중이고 개발 단계일때만
  // * 네트워크 디버깅용 로거를 설치합니다.
  if (process.browser && process.env.NODE_ENV === 'development') {
    installLogger(instance)
  }

  return instance
}

/**
 * Axios 사용시 추천되는 기본 옵션들을 설치합니다.
 */
export const installDefaults = (instance: AxiosInstance) => {
  // * 기본 헤더를 정의합니다.
  instance.defaults.headers = {
    ...instance.defaults.headers,
    Pragma: 'no-cache',
    'Cache-Control': 'no-cache'
  }

  // * 브라우저 쿠키 값을 요청에 포함합니다.
  instance.defaults.withCredentials = true
}

/**
 * 네트워크 요청 디버깅용 로거를 설치합니다.
 */
export const installLogger = (instance: AxiosInstance) => {
  // * 요청이 발생하기 전에 작동합니다.
  instance.interceptors.request.use(
    (config) => {
      // * 브라우저에서 개발 중에 어떠한 요청이 송신되고 있는지를 알려줍니다.
      window.console.log(
        `%c📦 API 요청 송신  주소:${
          config.url
        } 유형:${config.method?.toUpperCase()}`,
        'color: #E19A56;',

        config.params
      )
      return config
    },
    (error) => {
      if (!process.browser) {
        /* eslint-disable no-console */
        const now = new Date()
        console.error(
          `${now.toISOString()} [ ${error.config.method.toUpperCase()} ] :`,
          error.request.path
        )
        console.log('\n[ Stack ] : ', error)

        if (error.request) {
          console.log(
            '\n[ RequestHeader ] : ',
            util.inspect(error.request._header)
          )
        }

        if (error.config) {
          console.log(
            '\n[ ConfigHeader ] : ',
            util.inspect(error.config.headers)
          )
          console.log(
            '\n[ RequestQuery ] : ',
            util.inspect(error.config.params)
          )
          console.log('\n[ RequestBody ] : ', util.inspect(error.config.data))
        }

        if (error.response) {
          console.log(
            '\n[ ResponseHeader ] : ',
            util.inspect(error.response.headers)
          )
          console.log(
            '\n[ ResponseData ] : ',
            util.inspect(error.response.data)
          )
        }

        console.log('======================================================\n')
      }
      return Promise.reject(error)
    }
  )

  // * 요청이 발생한 후에 작동합니다.
  instance.interceptors.response.use(
    (response) => {
      // * 브라우저에서 개발 중에 어떠한 응답이 수신되고 있는지를 알려줍니다.
      window.console.log(
        `%c📫 API 응답 수신  주소:${
          response.config.url
        } 유형:${response.config.method?.toUpperCase()}`,
        'color: #31B4D9;',
        response
      )
      return response
    },
    (error) => {
      return Promise.reject(error)
    }
  )
}

export const setToken = (
  instance: AxiosInstance,
  accessToken: string | null
): void => {
  if (accessToken) {
    instance.defaults.headers.common.Authorization = `Bearer ${accessToken}`
  } else {
    delete instance.defaults.headers.common.Authorization
  }
}

import { ReactNode } from 'react'
import style from 'components/layouts/Default.scss'

type Props = {
  children: ReactNode
}

const LayoutDefault = ({ children }: Props) => {
  return (
    <>
      <main className="pageLayout">{children}</main>
      <style jsx>{style}</style>
    </>
  )
}

export default LayoutDefault

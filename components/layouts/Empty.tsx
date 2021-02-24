import { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

const LayoutEmpty = ({ children }: Props) => {
  return <div className="pageLayout -empty">{children}</div>
}

export default LayoutEmpty

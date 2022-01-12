import React from 'react'
import useHttpLocations from '../../utils/hooks/useHttpLocations'
import Logo from './index'



export default function ListLogo({
  logoURI,
  size = '24px',
  squared,
  alt,
}: {
  logoURI: string
  size?: string
  squared:boolean,
  alt?: string
}) {
  const srcs: string[] = useHttpLocations(logoURI)

  return <Logo srcs={srcs} width={size} height={size} alt={alt} squared={squared}  />
}

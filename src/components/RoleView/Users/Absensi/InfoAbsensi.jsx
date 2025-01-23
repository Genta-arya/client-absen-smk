import React from 'react'
import { useLocation, useParams } from 'react-router-dom'
import ContainerGlobal from '../../../ContainerGlobal'

const InfoAbsensi = () => {
    const {id} = useParams()
  return (
   <ContainerGlobal>{id}</ContainerGlobal>
  )
}

export default InfoAbsensi
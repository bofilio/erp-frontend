import React, { useContext, useEffect } from 'react'
import { CurrentAppContext } from '../../contexts'

const index = () => {
  const { setCurrentApp } = useContext(CurrentAppContext)
  
  useEffect(() => {
    setCurrentApp("grh")
  }, [])

  return (
    <div>Applicatiojn GRH</div>
  )
}

export default index
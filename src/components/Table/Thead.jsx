import React from 'react'

const Thead = ({children}) => {
  return (
    <thead className='text-center dark:bg-oren bg-blue text-white dark:text-white'>
       {children}
    </thead>
  )
}

export default Thead

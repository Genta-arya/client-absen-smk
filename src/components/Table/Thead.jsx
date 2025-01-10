import React from 'react'

const Thead = ({children}) => {
  return (
    <thead className='text-center dark:bg-orange-400 bg-gray-500 text-white dark:text-white'>
       {children}
    </thead>
  )
}

export default Thead

import React from 'react'

const NavBar = () => {
  return (
    <nav className="flex items-center justify-between px-6 py-2 backdrop-blur bg-surface border-b border-border">

      <h1 className="text-primary font-bold text-lg">
        DevCollab
      </h1>


      <div className='right-20 text-secondary font-semiBold'>
        {['Login', 'SignUp'].map(item => (
          <button className='hover:text-primary transition-all duration-200 hover:bg-gray-900 py-2 px-3 rounded-md'>
            <h1>{item}</h1>
          </button>
        ))}
      </div>

    </nav>
  )
}

export default NavBar
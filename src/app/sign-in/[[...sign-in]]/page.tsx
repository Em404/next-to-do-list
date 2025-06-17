import { SignIn } from '@clerk/nextjs'
import React from 'react'

function page() {
  return (
    <div className='flex justify-center items-center mt-12'>
      <SignIn forceRedirectUrl="/to-do-list"/>
    </div>
  )
}

export default page
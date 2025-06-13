'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Pending', href: '/pending' },
    { name: 'In progress', href: '/in-progress' },
    { name: 'Done', href: '/done' },
  ]

  const mobileNavbar = () => {
    return (
      <div className="relative">
        <div className="flex justify-between items-center py-2 px-4">
          <p className="text-lg font-bold">Next Task List</p>
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="absolute top-full left-0 w-full bg-white shadow-md z-10 py-4 px-4">
            <ul className="space-y-4">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="block text-gray-700 font-semibold hover:underline decoration-purple-500 decoration-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    )
  }

  const desktopNavbar = () => {
    return (
      <div className="flex justify-between items-center py-2">
        <p className="text-lg font-bold">Next Task List</p>
        <ul className="flex space-x-8">
          {navLinks.map((link) => (
            <li key={link.name}>
              <Link
                href={link.href}
                className="hover:cursor-pointer hover:underline decoration-purple-500 decoration-2 rounded-2xl font-semibold"
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  return (
    <div className="mb-4 border-b">
      <div className="block lg:hidden">{mobileNavbar()}</div>
      <div className="hidden lg:block">{desktopNavbar()}</div>
    </div>
  )
}

export default Navbar

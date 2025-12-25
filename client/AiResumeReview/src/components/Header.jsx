import { useState, useEffect, Fragment } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'

// Default fallback image if user has no photo
const DEFAULT_AVATAR = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"

const navigation = [
  { name: 'Home', href: '/', current: false },
  { name: 'Dashboard', href: '/dashboard', current: false },
  { name: 'Find Jobs', href: '/jobs', current: false },
]

const userNavigation = [
  { name: 'Your Profile', href: '/profile' },
  { name: 'Settings', href: '/settings' },
  { name: 'Sign out', href: '#' },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Header() {
  const navigate = useNavigate()
  const [user, setUser] = useState({ name: '', email: '', imageUrl: DEFAULT_AVATAR })
  
  // 1. Check Authentication Status
  const isAuthenticated = !!localStorage.getItem('access_token')

  // 2. Load User Data from Local Storage on Mount
  useEffect(() => {
    if (isAuthenticated) {
        const name = localStorage.getItem('user_name') || 'User'
        const email = localStorage.getItem('user_email') || ''
        const image = localStorage.getItem('user_image') || DEFAULT_AVATAR

        setUser({ name, email, imageUrl: image })
    }
  }, [isAuthenticated])

  // 3. Handle Logout
  const handleLogout = () => {
    localStorage.clear() // Clears all tokens and user info
    navigate('/')
    window.location.reload()
  }

  // 4. Handle Dropdown Clicks
  const handleProfileClick = (itemName) => {
    if (itemName === 'Sign out') {
      handleLogout()
    }
  }

  return (
    <div className="min-h-full">
      <Disclosure as="nav" className="bg-gray-800 border-b border-gray-700">
        {({ open }) => (
          <>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex h-16 items-center justify-between">
                
                {/* --- LEFT SIDE: LOGO & LINKS --- */}
                <div className="flex items-center">
                  <div className="shrink-0">
                    <Link to="/">
                        <img
                        alt="Your Company"
                        src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
                        className="size-8"
                        />
                    </Link>
                  </div>
                  <div className="hidden md:block">
                    <div className="ml-10 flex items-baseline space-x-4">
                      {navigation.map((item) => (
                        <Link
                          key={item.name}
                          to={item.href}
                          aria-current={item.current ? 'page' : undefined}
                          className={classNames(
                            item.current
                              ? 'bg-gray-900 text-white'
                              : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                            'rounded-md px-3 py-2 text-sm font-medium',
                          )}
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>

                {/* --- RIGHT SIDE: AUTHENTICATION --- */}
                <div className="hidden md:block">
                  <div className="ml-4 flex items-center md:ml-6">
                    
                    {isAuthenticated ? (
                        // ============ VIEW FOR LOGGED IN USERS ============
                        <>
                            <button
                                type="button"
                                className="relative rounded-full p-1 text-gray-400 hover:text-white focus:outline-2 focus:outline-offset-2 focus:outline-indigo-500"
                            >
                                <span className="absolute -inset-1.5" />
                                <span className="sr-only">View notifications</span>
                                <BellIcon aria-hidden="true" className="size-6" />
                            </button>

                            {/* Profile dropdown */}
                            <Menu as="div" className="relative ml-3">
                                <div>
                                    <MenuButton className="relative flex max-w-xs items-center rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                                    <span className="absolute -inset-1.5" />
                                    <span className="sr-only">Open user menu</span>
                                    {/* DYNAMIC IMAGE HERE */}
                                    <img alt="" src={user.imageUrl} className="size-8 rounded-full object-cover" />
                                    </MenuButton>
                                </div>
                                <Transition
                                    as={Fragment}
                                    enter="transition ease-out duration-100"
                                    enterFrom="transform opacity-0 scale-95"
                                    enterTo="transform opacity-100 scale-100"
                                    leave="transition ease-in duration-75"
                                    leaveFrom="transform opacity-100 scale-100"
                                    leaveTo="transform opacity-0 scale-95"
                                >
                                    <MenuItems className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 focus:outline-none">
                                    {userNavigation.map((item) => (
                                        <MenuItem key={item.name}>
                                            <button
                                                onClick={() => handleProfileClick(item.name)}
                                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100"
                                            >
                                                {item.name}
                                            </button>
                                        </MenuItem>
                                    ))}
                                    </MenuItems>
                                </Transition>
                            </Menu>
                        </>
                    ) : (
                        // ============ VIEW FOR GUESTS ============
                        <div className="flex gap-4">
                            <Link to="/login" className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium">
                                Log in
                            </Link>
                            <Link to="/register" className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-md px-3 py-2 text-sm font-medium">
                                Sign up
                            </Link>
                        </div>
                    )}

                  </div>
                </div>

                {/* --- MOBILE MENU BUTTON --- */}
                <div className="-mr-2 flex md:hidden">
                  <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                    <span className="absolute -inset-0.5" />
                    <span className="sr-only">Open main menu</span>
                    <Bars3Icon aria-hidden="true" className="block size-6 group-data-open:hidden" />
                    <XMarkIcon aria-hidden="true" className="hidden size-6 group-data-open:block" />
                  </DisclosureButton>
                </div>
              </div>
            </div>

            {/* --- MOBILE PANEL --- */}
            <DisclosurePanel className="md:hidden">
              <div className="space-y-1 px-2 pt-2 pb-3 sm:px-3">
                {navigation.map((item) => (
                  <DisclosureButton
                    key={item.name}
                    as={Link}
                    to={item.href}
                    aria-current={item.current ? 'page' : undefined}
                    className={classNames(
                      item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                      'block rounded-md px-3 py-2 text-base font-medium',
                    )}
                  >
                    {item.name}
                  </DisclosureButton>
                ))}
              </div>
              
              {/* MOBILE AUTH SECTION */}
              <div className="border-t border-gray-700 pt-4 pb-3">
                {isAuthenticated ? (
                    // Mobile Logged In View
                    <>
                        <div className="flex items-center px-5">
                        <div className="shrink-0">
                            <img alt="" src={user.imageUrl} className="size-10 rounded-full object-cover" />
                        </div>
                        <div className="ml-3">
                            <div className="text-base/5 font-medium text-white">{user.name}</div>
                            <div className="text-sm font-medium text-gray-400">{user.email}</div>
                        </div>
                        <button
                            type="button"
                            className="relative ml-auto shrink-0 rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                        >
                            <span className="absolute -inset-1.5" />
                            <span className="sr-only">View notifications</span>
                            <BellIcon aria-hidden="true" className="size-6" />
                        </button>
                        </div>
                        <div className="mt-3 space-y-1 px-2">
                            {userNavigation.map((item) => (
                                <DisclosureButton
                                key={item.name}
                                as="button"
                                onClick={() => handleProfileClick(item.name)}
                                className="block w-full text-left rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
                                >
                                {item.name}
                                </DisclosureButton>
                            ))}
                        </div>
                    </>
                ) : (
                     // Mobile Guest View
                     <div className="space-y-1 px-2">
                        <DisclosureButton as={Link} to="/login" className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white">
                            Log in
                        </DisclosureButton>
                        <DisclosureButton as={Link} to="/register" className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white">
                            Sign up
                        </DisclosureButton>
                     </div>
                )}
              </div>
            </DisclosurePanel>
          </>
        )}
      </Disclosure>
    </div>
  )
}
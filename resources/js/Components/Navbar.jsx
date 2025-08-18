import React, { useState } from 'react';
import { Link, usePage} from '@inertiajs/react';
import Dropdown from '@/Components/Dropdown';




export default function Navbar({ auth }) {
    const [expanded, setExpanded] = useState(false);
    const { url} = usePage();
    const { cartCount } = usePage().props;



    const isAdmin = auth?.user?.role === 'admin';
    const isNotDashboard = url !== '/dashboard';

    return (
        <div className="overflow-x-hidden bg-gray-50">
            <header className="py-4 md:py-6">
                <div className="container px-4 mx-auto sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between">
                        <div className="flex-shrink-0">
                            <Link href="/" className="flex rounded outline-none">
                                <img className="w-auto h-8" src="https://cdn.rareblocks.xyz/collection/clarity/images/logo.svg" alt="Logo" />
                            </Link>
                        </div>

                        <div className="flex items-center gap-4 lg:hidden">
                            <button
                                type="button"
                                className="text-gray-900"
                                aria-expanded={expanded}
                                onClick={() => setExpanded(!expanded)}
                            >
                                {expanded ? (
                                    <svg className="w-7 h-7" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                ) : (
                                    <svg className="w-7 h-7" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 6h16M4 12h16M4 18h16" /></svg>
                                )}
                            </button>
                            <Link href={route('cart.index')} className="relative text-gray-900">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2"
                viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.2 6h11.4L17 13M7 13L5.4 5M17 13l1.6-8" />
            </svg>
            {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 text-xs bg-red-600 text-white w-5 h-5 rounded-full flex items-center justify-center">
                    {cartCount}
                </span>
            )}
        </Link>

                        </div>

                        <div className="hidden lg:flex lg:ml-16 lg:items-center lg:justify-center lg:space-x-10 xl:space-x-16">
                            <Link href="/" className="text-base font-medium text-gray-900 hover:text-opacity-50">Home</Link>
                            <Link href="/best-sellers" className="text-base font-medium text-gray-900 hover:text-opacity-50">Best Sellers</Link>
                            <Link href="/productpage" className="text-base font-medium text-gray-900 hover:text-opacity-50">Products</Link>
                        </div>

                        <div className="hidden lg:ml-auto lg:flex lg:items-center lg:space-x-12">
                            {auth && auth.user ? (
                                auth.user.role === 'admin' ? (
                                    <Link
                                        href={route('dashboard')}
                                        className="rounded-md px-3 py-2 text-black ring-1 ring-transparent transition hover:text-black/70 focus:outline-none focus-visible:ring-[#FF2D20] dark:text-white dark:hover:text-white/80 dark:focus-visible:ring-white"
                                    >
                                        Dashboard
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href={route('profile.edit')}
                                            className="rounded-md px-3 py-2 text-black ring-1 ring-transparent transition hover:text-black/70 focus:outline-none focus-visible:ring-[#FF2D20] dark:text-white dark:hover:text-white/80 dark:focus-visible:ring-white"
                                        >
                                            Profile
                                        </Link>
                                         <Link
                                            href={route('my.orders')}
                                            className="rounded-md px-3 py-2 text-black ring-1 ring-transparent transition hover:text-black/70 focus:outline-none focus-visible:ring-[#FF2D20] dark:text-white dark:hover:text-white/80 dark:focus-visible:ring-white"
                                        >
                                        Orders
                                        </Link>
                                        <Dropdown.Link
                                            href={route('logout')}
                                            method="post"
                                            as="button"
                                        >
                                            Log Out
                                        </Dropdown.Link>
                                    </>
                                )
                            ) : (
                                <>
                                    <Link
                                        href={route('login')}
                                        className="rounded-md px-3 py-2 text-black ring-1 ring-transparent transition hover:text-black/70 focus:outline-none focus-visible:ring-[#FF2D20] dark:text-white dark:hover:text-white/80 dark:focus-visible:ring-white"
                                    >
                                        Log in
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        className="rounded-md px-3 py-2 text-black ring-1 ring-transparent transition hover:text-black/70 focus:outline-none focus-visible:ring-[#FF2D20] dark:text-white dark:hover:text-white/80 dark:focus-visible:ring-white"
                                    >
                                        Register
                                    </Link>
                                </>
                                
                            )}
                            {isAdmin && isNotDashboard && (
                                <Dropdown.Link
                                    href={route('logout')}
                                    method="post"
                                    as="button"
                                    className="rounded-md px-3 py-2 text-black ring-1 ring-transparent transition hover:text-black/70"
                                >
                                    Log Out
                                </Dropdown.Link>
                            )}
                           
                              <Link href={route('cart.index')} className="relative text-gray-900">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2"
                viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.2 6h11.4L17 13M7 13L5.4 5M17 13l1.6-8" />
            </svg>
            {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 text-xs bg-red-600 text-white w-5 h-5 rounded-full flex items-center justify-center">
                    {cartCount}
                </span>
            )}
        </Link>


                        </div>

                    </div>

                    {expanded && (
                        <nav className="px-1 py-8 lg:hidden">
                            <div className="grid gap-y-7">
                                <Link href="/" className="text-base font-medium text-gray-900 hover:text-opacity-50">Home</Link>
                                <Link href="/best-sellers" className="text-base font-medium text-gray-900 hover:text-opacity-50">Best Sellers</Link>
                                <Link href="/productpage" className="text-base font-medium text-gray-900 hover:text-opacity-50">Products</Link>
                                {auth && auth.user ? (
                                    auth.user.role === 'admin' ? (
                                        <Link
                                            href={route('dashboard')}
                                            className="rounded-md px-3 py-2 text-black ring-1 ring-transparent transition hover:text-black/70 focus:outline-none focus-visible:ring-[#FF2D20] dark:text-white dark:hover:text-white/80 dark:focus-visible:ring-white"
                                        >
                                            Dashboard
                                        </Link>
                                    ) : (
                                        <>
                                            <Link
                                                href={route('profile.edit')}
                                                className="rounded-md px-3 py-2 text-black ring-1 ring-transparent transition hover:text-black/70 focus:outline-none focus-visible:ring-[#FF2D20] dark:text-white dark:hover:text-white/80 dark:focus-visible:ring-white"
                                            >
                                                Profile
                                            </Link>
                                             <Link
                                            href={route('my.orders')}
                                            className="rounded-md px-3 py-2 text-black ring-1 ring-transparent transition hover:text-black/70 focus:outline-none focus-visible:ring-[#FF2D20] dark:text-white dark:hover:text-white/80 dark:focus-visible:ring-white"
                                        >
                                        Orders
                                        </Link>
                                            <Dropdown.Link
                                                href={route('logout')}
                                                method="post"
                                                as="button"
                                            >
                                                Log Out
                                            </Dropdown.Link>
                                        </>
                                    )
                                ) : (
                                    <>
                                        <Link
                                            href={route('login')}
                                            className="rounded-md px-3 py-2 text-black ring-1 ring-transparent transition hover:text-black/70 focus:outline-none focus-visible:ring-[#FF2D20] dark:text-white dark:hover:text-white/80 dark:focus-visible:ring-white"
                                        >
                                            Log in
                                        </Link>
                                        <Link
                                            href={route('register')}
                                            className="rounded-md px-3 py-2 text-black ring-1 ring-transparent transition hover:text-black/70 focus:outline-none focus-visible:ring-[#FF2D20] dark:text-white dark:hover:text-white/80 dark:focus-visible:ring-white"
                                        >
                                            Register
                                        </Link>
                                    </>
                                )}
                            </div>
                            {isAdmin && isNotDashboard && (
                                <Dropdown.Link
                                    href={route('logout')}
                                    method="post"
                                    as="button"
                                    className="rounded-md px-3 py-2 text-black ring-1 ring-transparent transition hover:text-black/70"
                                >
                                    Log Out
                                </Dropdown.Link>
                            )}

                        </nav>
                        
                    )}
                </div>
            </header>
        </div>
    );
};


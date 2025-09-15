'use client'
import { BaggageClaim, CircleUserRound, Menu, Search, ShoppingCart, X } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { clearUser, updateUser } from '../lib/features/user/userSlice'

const Navbar = () => {

    const router = useRouter();
    const path = usePathname();
    const dispatch = useDispatch();

    const { cartItems } = useSelector(state => state.cart)
    const user = useSelector(state => state.user.user)

    const [showMenu, setShowMenu] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [scrolled, setScrolled] = useState(false)

    const handleSearch = (e) => {
        e.preventDefault()
        router.push(`/search?q=${searchQuery}`)
    }

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setScrolled(true)
            } else {
                setScrolled(false)
            }
        }

        window.addEventListener('scroll', handleScroll)

        return () => {
            window.removeEventListener('scroll', handleScroll)
        }
    }, [])

    return (
        <div className={`w-full ${scrolled ? 'bg-white/80 backdrop-blur-lg' : 'bg-transparent'}  text-slate-700 sticky top-0 z-50`}>
            <div className={`flex items-center justify-between transition-all duration-300 ${scrolled ? "py-3" : "py-6"} max-w-7xl mx-auto px-6`}>
                <div className="flex items-center justify-center gap-12">
                    <Link href="/" className="flex items-center justify-center gap-2 text-2xl font-bold">
                        <BaggageClaim size={30} />
                        <h1>Shoppee</h1>
                    </Link>
                    <div className="flex items-center justify-center gap-8 text-sm max-lg:hidden">
                        <Link href="/" className={`${path === '/' && "text-slate-900 font-semibold"} hover:text-slate-900 transition-all`}>Home</Link>
                        <Link href="/products" className={`${path === '/products' && "text-slate-900 font-semibold"} hover:text-slate-900 transition-all`}>All Products</Link>
                        <Link href="/about" className={`${path === '/about' && "text-slate-900 font-semibold"} hover:text-slate-900 transition-all`}>About</Link>
                        <Link href="/contact" className={`${path === '/contact' && "text-slate-900 font-semibold"} hover:text-slate-900 transition-all`}>Contact</Link>
                    </div>
                </div>
                <div className="flex items-center justify-center gap-3">
                    <form onSubmit={handleSearch} className="flex items-center justify-center gap-2 border rounded-full px-3 py-1.5 max-md:hidden">
                        <button type='submit'><Search size={20} /></button>
                        <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search Products..." className="text-sm outline-none bg-transparent w-44" />
                    </form>
                    <Link href="/cart" className='relative p-2 border rounded-full hover:bg-slate-100/50 transition-colors'>
                        <ShoppingCart size={20} />
                        <div className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">{Object.keys(cartItems).length}</div>
                    </Link>
                    {
                        user ? (
                            <div className='relative group'>
                                <div className='p-2 border rounded-full hover:bg-slate-100/50 transition-colors cursor-pointer'>
                                    <CircleUserRound size={20} />
                                </div>
                                <div className="absolute top-10 right-0 bg-white shadow-lg rounded-lg p-4 w-48 hidden group-hover:block">
                                    <p className='text-sm'>{user.name}</p>
                                    <p className='text-xs text-slate-500'>{user.email}</p>
                                    <button onClick={() => dispatch(clearUser())} className='text-xs text-red-500 mt-2'>Logout</button>
                                </div>
                            </div>
                        ) : (
                            <Link href="/login" className='p-2 border rounded-full hover:bg-slate-100/50 transition-colors'>
                                <CircleUserRound size={20} />
                            </Link>
                        )
                    }
                    <button onClick={() => setShowMenu(true)} className='p-2 border rounded-full hover:bg-slate-100/50 transition-colors lg:hidden'>
                        <Menu size={20} />
                    </button>
                </div>
                {
                    showMenu && (
                        <div className="fixed top-0 right-0 w-full h-screen bg-white text-slate-700 p-6 lg:hidden">
                            <div className="flex items-center justify-between">
                                <Link href="/" className="flex items-center justify-center gap-2 text-2xl font-bold">
                                    <BaggageClaim size={30} />
                                    <h1>Shoppee</h1>
                                </Link>
                                <button onClick={() => setShowMenu(false)} className='p-2 border rounded-full hover:bg-slate-100/50 transition-colors'>
                                    <X size={20} />
                                </button>
                            </div>
                            <div className="flex flex-col items-start justify-center gap-6 text-sm mt-12">
                                <Link href="/" className={`${path === '/' && "text-slate-900 font-semibold"} hover:text-slate-900 transition-all`}>Home</Link>
                                <Link href="/products" className={`${path === '/products' && "text-slate-900 font-semibold"} hover:text-slate-900 transition-all`}>All Products</Link>
                                <Link href="/about" className={`${path === '/about' && "text-slate-900 font-semibold"} hover:text-slate-900 transition-all`}>About</Link>
                                <Link href="/contact" className={`${path === '/contact' && "text-slate-900 font-semibold"} hover:text-slate-900 transition-all`}>Contact</Link>
                            </div>
                        </div>
                    )
                }
            </div>
        </div>
    )
}

export default Navbar

'use client'
import { updateUser } from '../../../lib/features/user/userSlice';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';

const Page = () => {

    const router = useRouter();
    const dispatch = useDispatch();

    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();

        const user = {
            email,
            password
        }

        const res = await fetch('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify(user)
        })

        const data = await res.json();

        if (data.status === 'success') {
            dispatch(updateUser(data.data));
            toast.success(data.message);
            router.push('/');
        } else {
            toast.error(data.message);
        }
    }

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-700">
            <div className="bg-white shadow rounded-xl p-6 w-full max-w-md">
                <h1 className="text-2xl font-semibold">Welcome Back</h1>
                <p className="text-sm text-slate-500">Login to your account</p>
                <form onSubmit={e => toast.promise(handleLogin(e), { loading: "Logging in..." })} className="flex flex-col gap-4 mt-6">
                    <div className="flex flex-col gap-2">
                        <label htmlFor="email">Email</label>
                        <input onChange={e => setEmail(e.target.value)} value={email} type="email" id="email" placeholder="Enter your email" className="border border-slate-300 p-2 rounded-lg" />
                    </div>
                    <div className="flex flex-col gap-2 relative">
                        <label htmlFor="password">Password</label>
                        <input onChange={e => setPassword(e.target.value)} value={password} type={showPassword ? "text" : "password"} id="password" placeholder="Enter your password" className="border border-slate-300 p-2 rounded-lg" />
                        {
                            showPassword ? <EyeOffIcon onClick={() => setShowPassword(false)} className="absolute right-3 top-10 cursor-pointer" size={20} /> : <EyeIcon onClick={() => setShowPassword(true)} className="absolute right-3 top-10 cursor-pointer" size={20} />
                        }
                    </div>
                    <button className="bg-slate-700 text-white p-2 rounded-lg">Login</button>
                </form>
                <p className="text-sm text-slate-500 mt-6 text-center">
                    Don't have an account? <Link href="/signup" className="text-slate-700 font-semibold">Signup</Link>
                </p>
            </div>
        </div>
    )
}

export default Page
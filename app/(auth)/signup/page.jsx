'use client'
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import toast from 'react-hot-toast';

const Page = () => {

    const router = useRouter();

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSignup = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        const user = {
            name,
            email,
            password
        }

        const res = await fetch('/api/auth/signup', {
            method: 'POST',
            body: JSON.stringify(user)
        })

        const data = await res.json();

        if (data.status === 'success') {
            toast.success(data.message);
            router.push('/login');
        } else {
            toast.error(data.message);
        }
    }

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-700">
            <div className="bg-white shadow rounded-xl p-6 w-full max-w-md">
                <h1 className="text-2xl font-semibold">Create an Account</h1>
                <p className="text-sm text-slate-500">Get started with Shoppee</p>
                <form onSubmit={e => toast.promise(handleSignup(e), { loading: "Creating your account..." })} className="flex flex-col gap-4 mt-6">
                    <div className="flex flex-col gap-2">
                        <label htmlFor="name">Name</label>
                        <input onChange={e => setName(e.target.value)} value={name} type="text" id="name" placeholder="Enter your name" className="border border-slate-300 p-2 rounded-lg" />
                    </div>
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
                    <div className="flex flex-col gap-2 relative">
                        <label htmlFor="confirm-password">Confirm Password</label>
                        <input onChange={e => setConfirmPassword(e.target.value)} value={confirmPassword} type={showConfirmPassword ? "text" : "password"} id="confirm-password" placeholder="Confirm your password" className="border border-slate-300 p-2 rounded-lg" />
                        {
                            showConfirmPassword ? <EyeOffIcon onClick={() => setShowConfirmPassword(false)} className="absolute right-3 top-10 cursor-pointer" size={20} /> : <EyeIcon onClick={() => setShowConfirmPassword(true)} className="absolute right-3 top-10 cursor-pointer" size={20} />
                        }
                    </div>
                    <button className="bg-slate-700 text-white p-2 rounded-lg">Signup</button>
                </form>
                <p className="text-sm text-slate-500 mt-6 text-center">
                    Already have an account? <Link href="/login" className="text-slate-700 font-semibold">Login</Link>
                </p>
            </div>
        </div>
    )
}

export default Page
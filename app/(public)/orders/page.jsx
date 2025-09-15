'use client'
import OrderItem from '@/components/OrderItem'
import PageTitle from '@/components/PageTitle'
import { TruckIcon } from 'lucide-react'
import React, { useEffect, useState } from 'react'

const page = () => {

    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)

    const fetchOrders = async () => {
        try {
            const res = await fetch('/api/orders');
            const data = await res.json();
            if (data.status === 'success') {
                setOrders(data.data);
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchOrders()
    }, [])

    return (
        <div className='min-h-screen'>
            <div className='max-w-7xl mx-auto'>
                <PageTitle heading='My Orders' text='Here is what you have ordered from us' />
                {
                    loading ? (
                        <div className='flex justify-center items-center h-[50vh]'>
                            <TruckIcon className='animate-bounce' />
                        </div>
                    ) : orders.length > 0 ? (
                        <div className="flex items-start justify-between gap-5 max-lg:flex-col p-6">
                            <table className="w-full max-w-5xl text-slate-500 table-auto border-separate border-spacing-y-12 border-spacing-x-4">
                                <thead>
                                    <tr className="max-sm:text-sm text-slate-600 max-md:hidden">
                                        <th className="text-left">Product</th>
                                        <th className="text-center">Total Price</th>
                                        <th className="text-left">Address</th>
                                        <th className="text-left">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map((order) => (
                                        <OrderItem order={order} key={order.id} />
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className='flex justify-center items-center h-[50vh]'>
                            <h1 className='text-2xl text-slate-400'>You have no orders yet</h1>
                        </div>
                    )
                }
            </div>
        </div>
    )
}

export default page

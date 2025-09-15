import { BaggageClaim, TruckIcon } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

const OrderItem = ({ order }) => {

    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || 'KSH'

    return (
        <tr className="max-md:block max-md:border max-md:p-4 max-md:rounded-lg max-md:space-y-4">
            <td className="flex gap-3 my-4">
                <div className="flex flex-col gap-3 items-center justify-center bg-slate-100 p-2 rounded-md">
                    {order.products.map(item => (
                        <Image key={item.product.id} src={item.product.images[0]} className="h-14 w-auto" alt="" width={45} height={45} />
                    ))}
                </div>
                <div className='flex flex-col gap-1'>
                    {order.products.map(item => (
                        <p key={item.product.id} className="max-sm:text-sm">{item.product.name}</p>
                    ))}
                </div>
            </td>
            <td className="text-center max-md:flex max-md:justify-between">
                <p className='md:hidden'>Total Price</p>
                <p>{currency}{order.total.toLocaleString()}</p>
            </td>
            <td className="text-center max-md:flex max-md:justify-between">
                <p className='md:hidden'>Address</p>
                <p>{order.address}</p>
            </td>
            <td className="text-left max-md:flex max-md:justify-between">
                <p className='md:hidden'>Status</p>
                <div className='flex items-center justify-center gap-2'>
                    <TruckIcon size={20} className='text-slate-600' />
                    <span>{order.status}</span>
                </div>
            </td>
        </tr>
    )
}

export default OrderItem

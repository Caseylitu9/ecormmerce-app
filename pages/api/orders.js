import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(req, res) {

    if (req.method === 'POST') {
        try {
            const order = JSON.parse(req.body)
            const createdOrder = await prisma.order.create({
                data: {
                    user: {
                        connect: { id: order.userId },
                    },
                    products: {
                        create: order.products.map(product => ({
                            product: {
                                connect: { id: product.productId },
                            },
                            quantity: product.quantity,
                        })),
                    },
                    total: order.total,
                    address: order.address.name + ", " + order.address.city + ", " + order.address.state + ", " + order.address.zip,
                    paymentMethod: order.paymentMethod,
                    coupon: order.coupon,
                },
            })
            res.status(200).json({ status: 'success', message: 'Order placed successfully', data: createdOrder })
        } catch (error) {
            console.log(error)
            res.status(500).json({ status: 'error', message: 'Something went wrong' })
        }
    }

    else if (req.method === 'GET') {
        try {
            const orders = await prisma.order.findMany({
                include: {
                    products: {
                        include: {
                            product: true
                        }
                    }
                },
                orderBy: {
                    createdAt: 'desc'
                }
            })

            res.status(200).json({ status: 'success', data: orders })

        } catch (error) {
            console.log(error)
            res.status(500).json({ status: 'error', message: 'Something went wrong' })
        }
    }

}
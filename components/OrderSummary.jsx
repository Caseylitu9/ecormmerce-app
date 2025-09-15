import { PlusIcon, SquarePenIcon, XIcon } from 'lucide-react';
import React, { useState } from 'react';
import AddressModal from './AddressModal';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { clearCart } from '../lib/features/cart/cartSlice';

const OrderSummary = ({ totalPrice, items }) => {
  const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || 'KSH';

  const router = useRouter();
  const dispatch = useDispatch();

  const addressList = useSelector((state) => state.address.list);
  const user = useSelector((state) => state.user.user);

  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [coupon, setCoupon] = useState('');

  const handleCouponCode = async (event) => {
    event.preventDefault();
    // TODO: implement coupon validation here
    // For now, fake example:
    if (couponCodeInput === 'DISCOUNT10') {
      setCoupon({ code: 'DISCOUNT10', discount: 10, description: '10% off' });
      toast.success('Coupon applied');
    } else {
      toast.error('Invalid coupon');
    }
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error('Please login to place an order');
      return;
    }

    if (!selectedAddress) {
      toast.error('Please select an address');
      return;
    }

    const order = {
      userId: user.id,
      address: selectedAddress,
      products: items.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
      })),
      total: coupon
        ? totalPrice - (coupon.discount / 100) * totalPrice
        : totalPrice,
      paymentMethod,
      coupon: coupon ? coupon.code : null,
    };

    const res = await fetch('/api/orders', {
      method: 'POST',
      body: JSON.stringify(order),
    });

    const data = await res.json();

    if (data.status === 'success') {
      toast.success(data.message);
      dispatch(clearCart());
      router.push('/orders');
    } else {
      toast.error(data.message);
    }
  };

  return (
    <div className="w-full max-w-lg lg:max-w-[340px] bg-slate-50/30 border border-slate-200 text-slate-500 text-sm rounded-xl p-7">
      <h2 className="text-xl font-medium text-slate-600">Payment Summary</h2>

      {/* Payment Method */}
      <p className="text-slate-400 text-xs my-4">Payment Method</p>
      <div className="flex gap-2 items-center">
        <input
          type="radio"
          id="COD"
          name="payment"
          onChange={() => setPaymentMethod('COD')}
          checked={paymentMethod === 'COD'}
          className="accent-gray-500"
        />
        <label htmlFor="COD" className="cursor-pointer">
          M-Pesa
        </label>
      </div>
      <div className="flex gap-2 items-center mt-1">
        <input
          type="radio"
          id="STRIPE"
          name="payment"
          onChange={() => setPaymentMethod('STRIPE')}
          checked={paymentMethod === 'STRIPE'}
          className="accent-gray-500"
        />
        <label htmlFor="STRIPE" className="cursor-pointer">
          Stripe Payment
        </label>
      </div>

      {/* Address */}
      <div className="my-4 py-4 border-y border-slate-200 text-slate-400">
        <p>Address</p>
        {selectedAddress ? (
          <div className="flex gap-2 items-center">
            <p>
              {selectedAddress.name}, {selectedAddress.city},{' '}
              {selectedAddress.state}, {selectedAddress.zip}
            </p>
            <SquarePenIcon
              onClick={() => setSelectedAddress(null)}
              className="cursor-pointer"
              size={18}
            />
          </div>
        ) : (
          <div>
            {addressList.length > 0 && (
              <select
                className="border border-slate-400 p-2 w-full my-3 outline-none rounded"
                onChange={(e) =>
                  setSelectedAddress(addressList[e.target.value])
                }
              >
                <option value="">Select Address</option>
                {addressList.map((address, index) => (
                  <option key={index} value={index}>
                    {address.name}, {address.city}, {address.state},{' '}
                    {address.zip}
                  </option>
                ))}
              </select>
            )}
            <button
              className="flex items-center gap-1 text-slate-600 mt-1"
              onClick={() => setShowAddressModal(true)}
            >
              Add Address <PlusIcon size={18} />
            </button>
          </div>
        )}
      </div>

      {/* Price summary */}
      <div className="pb-4 border-b border-slate-200">
        <div className="flex justify-between">
          <div className="flex flex-col gap-1 text-slate-400">
            <p>Subtotal:</p>
            <p>Shipping:</p>
            {coupon && <p>Coupon:</p>}
          </div>
          <div className="flex flex-col gap-1 font-medium text-right">
            <p>{currency}{totalPrice.toLocaleString()}</p>
            <p>Free</p>
            {coupon && (
              <p>
                -{currency}
                {(coupon.discount / 100 * totalPrice).toFixed(2)}
              </p>
            )}
          </div>
        </div>

        {/* Coupon */}
        {!coupon ? (
          <form
            onSubmit={(e) =>
              toast.promise(handleCouponCode(e), {
                loading: 'Checking Coupon...',
              })
            }
            className="flex justify-center gap-3 mt-3"
          >
            <input
              onChange={(e) => setCouponCodeInput(e.target.value)}
              value={couponCodeInput}
              type="text"
              placeholder="Coupon Code"
              className="border border-slate-400 p-1.5 rounded w-full outline-none"
            />
            <button className="bg-slate-600 text-white px-3 rounded hover:bg-slate-800 active:scale-95 transition-all">
              Apply
            </button>
          </form>
        ) : (
          <div className="w-full flex items-center justify-center gap-2 text-xs mt-2">
            <p>
              Code: <span className="font-semibold ml-1">{coupon.code.toUpperCase()}</span>
            </p>
            <p>{coupon.description}</p>
            <XIcon
              size={18}
              onClick={() => setCoupon('')}
              className="hover:text-red-700 transition cursor-pointer"
            />
          </div>
        )}
      </div>

      {/* Total */}
      <div className="flex justify-between py-4">
        <p>Total:</p>
        <p className="font-medium text-right">
          {currency}
          {coupon
            ? (totalPrice - (coupon.discount / 100) * totalPrice).toFixed(2)
            : totalPrice.toLocaleString()}
        </p>
      </div>

      {/* Place order button */}
      <button
        onClick={(e) =>
          toast.promise(handlePlaceOrder(e), { loading: 'Placing Order...' })
        }
        className="w-full bg-slate-700 text-white py-2.5 rounded hover:bg-slate-900 active:scale-95 transition-all"
      >
        Place Order
      </button>

      {showAddressModal && (
        <AddressModal setShowAddressModal={setShowAddressModal} />
      )}
    </div>
  );
};

export default OrderSummary;

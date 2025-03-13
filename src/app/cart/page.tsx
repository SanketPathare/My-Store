"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const router = useRouter();
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('credit_card'); // Default payment method
  const [orderConfirmation, setOrderConfirmation] = useState(null);
  const [loading, setLoading] = useState(false);   

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartItems(storedCart);
  }, []);

  useEffect(() => {
    const newTotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    setTotal(newTotal);
  }, [cartItems]);

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeItem(itemId);
      return;
    }

    const updatedCart = cartItems.map(item =>
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    );
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const removeItem = (itemId) => {
    const updatedCart = cartItems.filter(item => item.id !== itemId);
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cart');
  };

  const handleCheckout = () => {
    setIsCheckoutModalOpen(true);
  };

  const closeCheckoutModal = () => {
    setIsCheckoutModalOpen(false);
  };

  const handleSubmitOrder = async () => {
    // Basic validation
    if (!name || !address) {
      alert('Please fill in your name and address.');
      return;
    }

    setLoading(true); // Start loading

    // Simulate an API call to process the order (replace with your actual API endpoint)
    try {
      // Simulate an API request delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Simulate success response
      const orderData = {
        orderId: Math.floor(Math.random() * 1000000),
        items: cartItems,
        total: total,
        shippingAddress: address,
        customerName: name,
        paymentMethod: paymentMethod,
        date: new Date().toLocaleDateString(),
      };

      setOrderConfirmation(orderData);
      clearCart(); // Clear the cart after successful order
      setIsCheckoutModalOpen(false);

    } catch (error) {
      console.error("Error submitting order:", error);
      alert("Failed to submit order. Please try again.");
    } finally {
      setLoading(false); // End loading
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8 flex-grow">
        <h1 className="text-3xl font-extrabold text-gray-800 mb-6 text-center">Shopping Cart</h1>

        {cartItems.length === 0 ? (
          <div className="text-gray-600 text-center py-8">Your cart is empty.  Let's find something <a href="/products" className="text-blue-500 hover:underline">to buy</a>!</div>
        ) : (
          <>
            <div className="overflow-hidden rounded-lg shadow-md">
              <table className="min-w-full leading-normal">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {cartItems.map(item => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-12 w-12 mr-3">
                            <img className="h-12 w-12 rounded-md object-cover" src={item.imageUrl} alt={item.name} />
                          </div>
                          <div>
                            <div className="text-gray-800 font-semibold">{item.name}</div>
                            {/* You can add a product description snippet here if you have it */}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        ${item.price.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        <div className="flex items-center">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-3 rounded-l"
                            aria-label="Decrease quantity"
                          >
                            -
                          </button>
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => {
                              const newQuantity = parseInt(e.target.value, 10);
                              if (!isNaN(newQuantity)) {
                                updateQuantity(item.id, newQuantity);
                              }
                            }}
                            className="mx-2 w-16 text-center border border-gray-300 rounded"
                            aria-label="Quantity"
                          />
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-3 rounded-r"
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        ${(item.price * item.quantity).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-red-600 hover:text-red-800 font-semibold"
                          aria-label="Remove item"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 flex flex-col md:flex-row justify-between items-center">
              <div className="text-xl font-semibold text-gray-800">Total: ${total.toFixed(2)}</div>
              <div className="mt-4 md:mt-0">
                <button
                  onClick={clearCart}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded mr-2"
                >
                  Clear Cart
                </button>
                <button
                  onClick={handleCheckout}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded"
                >
                  Checkout
                </button>
              </div>
            </div>
          </>
        )}

        {/* Checkout Modal */}
        {isCheckoutModalOpen && (
          <div className="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
              <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                    Checkout Information
                  </h3>
                  <div className="mt-2">
                    <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">Name:</label>
                    <input
                      type="text"
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      placeholder="Your Name"
                    />

                    <label htmlFor="address" className="block text-gray-700 text-sm font-bold mb-2 mt-4">Shipping Address:</label>
                    <textarea
                      id="address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      placeholder="Your Shipping Address"
                    />

                    <label htmlFor="paymentMethod" className="block text-gray-700 text-sm font-bold mb-2 mt-4">Payment Method:</label>
                    <select
                      id="paymentMethod"
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    >
                      <option value="credit_card">Credit Card</option>
                      <option value="paypal">PayPal</option>
                      <option value="cash_on_delivery">Cash on Delivery</option>
                    </select>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:ml-3 sm:w-auto sm:text-sm ${
                      loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary hover:bg-primary-dark'
                    }`}
                    onClick={handleSubmitOrder}
                    disabled={loading}
                  >
                    {loading ? (
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
                      'Submit Order'
                    )}
                  </button>
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={closeCheckoutModal}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Order Confirmation */}
        {orderConfirmation && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Order Confirmed!</strong>
            <span className="block sm:inline"> Thank you for your order.</span>
            <br />
            <span className="block sm:inline"> Order ID: {orderConfirmation.orderId}</span>
            <br />
            <span className="block sm:inline"> Shipping to: {orderConfirmation.shippingAddress}</span>
            <br />
            <span className="block sm:inline"> Payment Method: {orderConfirmation.paymentMethod}</span>
            <br />
            <span className="block sm:inline"> Order Date: {orderConfirmation.date}</span>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Cart;
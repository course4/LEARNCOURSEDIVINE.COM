import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Lock, CreditCard, ArrowLeft, CheckCircle2, Loader2, Sparkles, User, Mail, Phone, MapPin } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import api from '../services/api';
import PaymentModal from '../components/PaymentModal';
import { getRazorpayKeyId } from '../config/razorpay';

const Checkout = () => {
  const { cartItems, finalAmount, subtotal, clearCart, cartCount } = useCart();
  const { user, isAuthenticated } = useAuth();
  const { showToast } = useNotification();
  const navigate = useNavigate();

  // Billing Details Form
  const [billing, setBilling] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    city: 'Hyderabad',
    state: 'Telangana',
    postalCode: '500081',
    country: 'India'
  });

  const [loading, setLoading] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);

  useEffect(() => {
    if (cartCount === 0) {
      navigate('/cart');
    }
  }, [cartCount, navigate]);

  const handleInitiateOrder = async (e) => {
    e.preventDefault();
    if (!billing.name || !billing.email || !billing.phone) {
      showToast('Please fill in all required billing information', 'error');
      return;
    }

    setLoading(true);

    try {
      // 1. Create order on backend API
      const res = await api.post('/payments/create-order', {
        items: cartItems.map((item) => ({
          courseId: item._id,
          price: item.discountPrice || item.price,
          title: item.title
        })),
        totalAmount: finalAmount,
        currency: 'INR',
        billingDetails: billing
      });

      if (res.data?.success && res.data.order) {
        setOrderDetails({
          orderId: res.data.order.id,
          amount: finalAmount,
          currency: 'INR',
          key: res.data.keyId || getRazorpayKeyId(),
          name: 'Course Divine',
          description: `Enrollment for ${cartCount} courses`,
          prefill: {
            name: billing.name,
            email: billing.email,
            contact: billing.phone
          }
        });
        setShowPaymentModal(true);
      } else {
        // Fallback simulated order for offline preview
        setOrderDetails({
          orderId: 'ORD_CD_' + Date.now().toString().slice(-6),
          amount: finalAmount,
          currency: 'INR',
          key: getRazorpayKeyId(),
          name: 'Course Divine',
          description: `Enrollment for ${cartCount} courses`,
          prefill: {
            name: billing.name,
            email: billing.email,
            contact: billing.phone
          }
        });
        setShowPaymentModal(true);
      }
    } catch (err) {
      // Fallback local order creation
      setOrderDetails({
        orderId: 'ORD_CD_' + Date.now().toString().slice(-6),
        amount: finalAmount,
        currency: 'INR',
        key: getRazorpayKeyId(),
        name: 'Course Divine',
        description: `Enrollment for ${cartCount} courses`,
        prefill: {
          name: billing.name,
          email: billing.email,
          contact: billing.phone
        }
      });


      setShowPaymentModal(true);
    } finally {
      setLoading(false);
    }
  };


  const handlePaymentSuccess = async (paymentData) => {
    setShowPaymentModal(false);

    // Direct FormSubmit email notification to coursedivine@gmail.com
    if (typeof window !== 'undefined' && billing) {
      const payload = new FormData();
      payload.append('Customer Name', billing.name);
      payload.append('Customer Email', billing.email);
      payload.append('Phone Number', billing.phone);
      payload.append('Order Total Amount', `₹${finalAmount || 0}`);
      payload.append('Cart Items Count', String(cartCount || 1));
      payload.append('Order ID', paymentData.razorpay_order_id || orderDetails?.orderId || 'ORD_' + Date.now());
      payload.append('_subject', `New Course Order Placed by ${billing.name} (₹${finalAmount || 0})`);
      payload.append('_captcha', 'false');

      fetch('https://formsubmit.co/ajax/coursedivine@gmail.com', {
        method: 'POST',
        body: payload
      }).catch(() => null);
    }

    showToast('🎉 Payment successful! Enrolling in courses...', 'success');
    clearCart();
    navigate(`/order-success/${paymentData.razorpay_order_id || orderDetails.orderId}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <Link
        to="/cart"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-brand-600"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Cart
      </Link>

      <div>
        <h1 className="text-3xl font-extrabold text-slate-900">Checkout & Instant Enrollment</h1>
        <p className="text-xs text-slate-500 mt-1">Provide student credentials for your verified certificate and course activation.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Billing Form */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <User className="w-5 h-5 text-brand-600" /> Student & Billing Details
            </h3>

            <form id="checkout-form" onSubmit={handleInitiateOrder} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={billing.name}
                    onChange={(e) => setBilling({ ...billing, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={billing.email}
                    onChange={(e) => setBilling({ ...billing, email: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number (WhatsApp) *</label>
                  <input
                    type="tel"
                    required
                    value={billing.phone}
                    onChange={(e) => setBilling({ ...billing, phone: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">City *</label>
                  <input
                    type="text"
                    required
                    value={billing.city}
                    onChange={(e) => setBilling({ ...billing, city: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">State / Province *</label>
                  <input
                    type="text"
                    required
                    value={billing.state}
                    onChange={(e) => setBilling({ ...billing, state: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Postal Code</label>
                  <input
                    type="text"
                    value={billing.postalCode}
                    onChange={(e) => setBilling({ ...billing, postalCode: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-sm shadow-lg shadow-brand-600/30 transition duration-200 flex items-center justify-center gap-2 disabled:opacity-75"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Preparing Payment Order...
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" /> Proceed to Pay ${finalAmount.toLocaleString('en-US')}.00
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column: Order Items Summary */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-200 shadow-xl space-y-6">
            <h3 className="text-lg font-extrabold text-slate-900">Enrolling in ({cartCount}) Courses</h3>

            <div className="space-y-3 divide-y divide-slate-100 max-h-72 overflow-y-auto pr-1">
              {cartItems.map((item) => (
                <div key={item._id} className="pt-3 first:pt-0 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80';
                      }}
                      className="w-12 h-10 rounded-lg object-cover border shrink-0 bg-slate-100"
                    />
                    <div>
                      <h4 className="font-bold text-xs text-slate-900 line-clamp-1">{item.title}</h4>
                      <p className="text-[10px] text-slate-400">{item.category}</p>
                    </div>
                  </div>
                  <span className="font-bold text-xs text-slate-900 shrink-0">
                    ${(item.discountPrice || item.price).toLocaleString('en-US')}.00
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span>${subtotal.toLocaleString('en-US')}.00</span>
              </div>
              <div className="flex justify-between text-emerald-600 font-semibold">
                <span>Total Discounts</span>
                <span>- ${(subtotal - finalAmount).toLocaleString('en-US')}.00</span>
              </div>
              <div className="flex justify-between text-base font-extrabold text-slate-900 pt-2 border-t border-slate-100">
                <span>Payable Amount</span>
                <span className="text-brand-600 font-mono">${finalAmount.toLocaleString('en-US')}.00</span>
              </div>
            </div>



            <div className="p-4 rounded-2xl bg-brand-50 text-xs text-brand-800 space-y-1">
              <div className="font-bold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-brand-600" /> Instant Enrollment
              </div>
              <p className="text-[11px] text-brand-600">
                Course videos, downloadable materials, and project files are instantly unlocked on your Dashboard upon payment.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && orderDetails && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          orderDetails={orderDetails}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
};

export default Checkout;

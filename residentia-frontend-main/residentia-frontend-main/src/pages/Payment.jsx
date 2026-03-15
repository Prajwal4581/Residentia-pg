import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import API from "../api/api";

const Payment = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    loadBookingAndInitiatePayment();
  }, [bookingId]);

  const loadBookingAndInitiatePayment = async () => {
    try {
      setLoading(true);
      
      // Create Razorpay order
      const res = await API.post(`/api/payment/create-order/${bookingId}`);
      const orderData = res.data;
      
      setBooking(orderData);
      
      // Load Razorpay script
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => openRazorpay(orderData);
      document.body.appendChild(script);
      
    } catch (err) {
      console.error("Payment initialization error:", err);
      toast.error("Failed to initialize payment: " + (err.response?.data || err.message));
      setLoading(false);
    }
  };

  const openRazorpay = (orderData) => {
    const options = {
      key: orderData.keyId,
      amount: orderData.amount * 100, // Amount in paise
      currency: orderData.currency,
      name: "PG Finder",
      description: `Booking Payment - #${bookingId}`,
      order_id: orderData.orderId,
      prefill: {
        name: orderData.tenantName,
        email: orderData.tenantEmail,
        contact: orderData.tenantPhone
      },
      theme: {
        color: "#6366f1"
      },
      handler: async function (response) {
        await verifyPayment(response);
      },
      modal: {
        ondismiss: function() {
          toast.info("Payment cancelled");
          navigate("/client");
        }
      }
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
    setLoading(false);
  };

  const verifyPayment = async (response) => {
    try {
      const verifyRes = await API.post('/api/payment/verify-payment', {
        razorpay_order_id: response.razorpay_order_id,
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_signature: response.razorpay_signature
      });

      if (verifyRes.data.success) {
        toast.success("Payment successful! Your booking is confirmed.");
        navigate("/client");
      } else {
        toast.error("Payment verification failed");
      }
    } catch (err) {
      console.error("Payment verification error:", err);
      toast.error("Payment verification failed: " + (err.response?.data?.error || err.message));
    }
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        flexDirection: 'column',
        gap: '20px'
      }}>
        <div style={{ fontSize: '48px' }}>💳</div>
        <h3>Initializing Payment...</h3>
        <p>Please wait while we prepare your payment gateway</p>
      </div>
    );
  }

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      flexDirection: 'column'
    }}>
      <h3>Payment Gateway</h3>
      <p>If the payment window didn't open, please click below:</p>
      <button 
        onClick={() => loadBookingAndInitiatePayment()}
        style={{
          padding: '12px 24px',
          background: '#6366f1',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '16px',
          fontWeight: 'bold'
        }}
      >
        Open Payment Window
      </button>
      <button 
        onClick={() => navigate("/client")}
        style={{
          marginTop: '12px',
          padding: '10px 20px',
          background: '#e5e7eb',
          color: '#374151',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer'
        }}
      >
        Cancel
      </button>
    </div>
  );
};

export default Payment;

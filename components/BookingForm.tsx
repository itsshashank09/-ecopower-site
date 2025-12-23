
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ServiceType } from '../types';
import { formatWhatsAppMessage, getWhatsAppUrl } from '../config';

const BookingForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    service: ServiceType.WIRING,
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [whatsappUrl, setWhatsappUrl] = useState<string>('');

  const sendNotification = (booking: any) => {
    // Store notification in localStorage for admin panel
    const notifications = JSON.parse(localStorage.getItem('ecopower_notifications') || '[]');
    const notification = {
      id: Date.now().toString(),
      type: 'new_booking',
      booking: booking,
      read: false,
      timestamp: new Date().toISOString()
    };
    notifications.unshift(notification);
    localStorage.setItem('ecopower_notifications', JSON.stringify(notifications));

    // Trigger storage event for real-time updates (if admin panel is open)
    window.dispatchEvent(new Event('storage'));

    // Note: WhatsApp opening is now handled in handleSubmit before this function is called
    // This function only handles browser notifications and localStorage storage

    // Browser notification (requires permission)
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('🔔 New Booking Received!', {
        body: `${booking.name} requested ${booking.service}. Phone: ${booking.phone}`,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: 'new-booking',
        requireInteraction: true
      });
    } else if ('Notification' in window && Notification.permission === 'default') {
      // Request permission for future notifications
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          new Notification('🔔 New Booking Received!', {
            body: `${booking.name} requested ${booking.service}. Phone: ${booking.phone}`,
            icon: '/favicon.ico',
            badge: '/favicon.ico',
            tag: 'new-booking',
            requireInteraction: true
          });
        }
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    if (!formData.name || !formData.phone) {
      alert("Please fill in required fields");
      setStatus('idle');
      return;
    }

    try {
      const bookings = JSON.parse(localStorage.getItem('ecopower_bookings') || '[]');
      const newBooking = {
        ...formData,
        id: Date.now().toString(),
        date: new Date().toLocaleString()
      };
      bookings.push(newBooking);
      localStorage.setItem('ecopower_bookings', JSON.stringify(bookings));

      // Create WhatsApp message and open immediately (while still in user interaction context)
      const whatsappMessage = formatWhatsAppMessage(newBooking);
      const whatsappUrl = getWhatsAppUrl(whatsappMessage);
      localStorage.setItem('ecopower_last_whatsapp_url', whatsappUrl);
      setWhatsappUrl(whatsappUrl); // Store for fallback button
      
      // Open WhatsApp immediately - create link and click it
      const link = document.createElement('a');
      link.href = whatsappUrl;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      setTimeout(() => {
        if (link.parentNode) {
          document.body.removeChild(link);
        }
      }, 100);

      // Send notification to admin (includes browser notifications)
      sendNotification(newBooking);

      setTimeout(() => {
        setStatus('success');
        setFormData({ name: '', phone: '', service: ServiceType.WIRING, message: '' });
      }, 1000);
    } catch (error) {
      setStatus('error');
    }
  };

  return (
    <section id="booking" className="py-24 bg-emerald-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="p-8 lg:p-16 bg-emerald-50">
              <h2 className="text-4xl font-extrabold text-gray-900 mb-6">Schedule Your Visit</h2>
              <p className="text-lg text-gray-600 mb-8">
                Fill out the form and our team will get back to you within 30 minutes. 
                For emergencies, please call us directly.
              </p>
              
              <div className="space-y-6">
                {[
                  "Verified Bangalore Experts",
                  "Flat Rate Pricing",
                  "100% Satisfaction Guarantee"
                ].map((text, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 + (i * 0.1) }}
                    className="flex items-center space-x-4"
                  >
                    <div className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center text-white">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-lg font-medium text-gray-800">{text}</span>
                  </motion.div>
                ))}
              </div>
            </div>
            
            <div className="p-8 lg:p-16 relative">
              <AnimatePresence mode="wait">
                {status === 'success' ? (
                  <motion.div 
                    key="success"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="text-center py-12"
                  >
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, damping: 10 }}
                      className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mx-auto mb-6"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </motion.div>
                    <h3 className="text-3xl font-bold text-gray-900 mb-2">Booking Received!</h3>
                    <p className="text-gray-600 mb-6">We will call you shortly to confirm the appointment.</p>
                    {whatsappUrl && (
                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center px-6 py-3 mb-4 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors font-bold text-sm"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.652zm6.599-3.835c1.474.873 3.103 1.332 4.775 1.332 5.146 0 9.333-4.187 9.333-9.332 0-2.492-.97-4.832-2.731-6.593s-4.102-2.731-6.593-2.731c-5.147 0-9.333 4.187-9.333 9.332 0 1.819.527 3.595 1.524 5.148l-.992 3.626 3.715-.974z" />
                        </svg>
                        Open WhatsApp Message
                      </a>
                    )}
                    <button 
                      onClick={() => {
                        setStatus('idle');
                        setWhatsappUrl('');
                      }}
                      className="text-emerald-600 font-bold hover:underline"
                    >
                      Make another booking
                    </button>
                  </motion.div>
                ) : (
                  <motion.form 
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubmit} 
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Your Name *</label>
                        <input 
                          type="text" 
                          required
                          className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-emerald-500 focus:ring-0 transition-colors"
                          placeholder="John Doe"
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number *</label>
                        <input 
                          type="tel" 
                          required
                          className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-emerald-500 focus:ring-0 transition-colors"
                          placeholder="+91 88611 56453"
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Service Required</label>
                      <select 
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-emerald-500 focus:ring-0 transition-colors bg-white"
                        value={formData.service}
                        onChange={(e) => setFormData({...formData, service: e.target.value as ServiceType})}
                      >
                        {Object.values(ServiceType).map((val) => (
                          <option key={val} value={val}>{val}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Additional Message</label>
                      <textarea 
                        rows={4}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-emerald-500 focus:ring-0 transition-colors"
                        placeholder="Tell us about the issue..."
                        value={formData.message}
                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                      ></textarea>
                    </div>
                    
                    <motion.button 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={status === 'loading'}
                      className="w-full py-4 rounded-xl bg-emerald-600 text-white font-bold text-lg hover:bg-emerald-700 transition-all disabled:opacity-50"
                    >
                      {status === 'loading' ? 'Processing...' : 'Submit Booking Request'}
                    </motion.button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default BookingForm;

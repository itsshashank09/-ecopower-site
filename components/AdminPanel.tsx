
import React, { useState, useEffect } from 'react';
import { Booking } from '../types';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { formatWhatsAppMessage, getWhatsAppUrl } from '../config';

const AdminPanel: React.FC = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('admin_auth') === 'true';
  });
  const [password, setPassword] = useState('');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [lastBookingId, setLastBookingId] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      loadBookings();
      checkNotifications();
      
      // Request notification permission when admin logs in
      if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
      }

      // Listen for new bookings in real-time
      const handleStorageChange = () => {
        loadBookings();
        checkNotifications();
      };

      // Listen for storage events (from other tabs/windows)
      window.addEventListener('storage', handleStorageChange);
      
      // Poll for changes (for same-tab updates)
      const interval = setInterval(() => {
        loadBookings();
        checkNotifications();
      }, 2000); // Check every 2 seconds

      return () => {
        window.removeEventListener('storage', handleStorageChange);
        clearInterval(interval);
      };
    }
  }, [isAuthenticated]);

  const checkNotifications = () => {
    const notifications = JSON.parse(localStorage.getItem('ecopower_notifications') || '[]');
    const unread = notifications.filter((n: any) => !n.read).length;
    setUnreadCount(unread);

    // Show browser notification if there's a new unread booking
    if (notifications.length > 0 && isAuthenticated) {
      const latestUnread = notifications.find((n: any) => !n.read);
      
      if (latestUnread && latestUnread.booking.id !== lastBookingId) {
        setLastBookingId(latestUnread.booking.id);
        
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('🔔 New Booking Alert!', {
            body: `${latestUnread.booking.name} - ${latestUnread.booking.service}`,
            icon: '/favicon.ico',
            tag: 'admin-booking-alert'
          });
        }
      }
    }
  };

  const markAllAsRead = () => {
    const notifications = JSON.parse(localStorage.getItem('ecopower_notifications') || '[]');
    notifications.forEach((n: any) => {
      n.read = true;
    });
    localStorage.setItem('ecopower_notifications', JSON.stringify(notifications));
    setUnreadCount(0);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123') {
      setIsAuthenticated(true);
      sessionStorage.setItem('admin_auth', 'true');
    } else {
      alert('Invalid password');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('admin_auth');
    navigate('/');
  };

  const loadBookings = () => {
    const data = JSON.parse(localStorage.getItem('ecopower_bookings') || '[]');
    const sorted = data.sort((a: any, b: any) => parseInt(b.id) - parseInt(a.id));
    setBookings(sorted);
    
    // Update last booking ID
    if (sorted.length > 0) {
      setLastBookingId(sorted[0].id);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-emerald-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-[2rem] shadow-2xl w-full max-w-md border border-emerald-100">
          <div className="w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-lg mx-auto mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-3xl font-extrabold text-center mb-2 text-gray-900">Staff Access</h2>
          <p className="text-center text-gray-500 mb-8 italic text-sm">Authorized Ecopower Personnel Only</p>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Access Key</label>
              <input 
                type="password"
                className="w-full px-5 py-4 rounded-xl border-2 border-gray-100 focus:border-emerald-500 focus:ring-0 transition-all outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoFocus
              />
            </div>
            <button 
              type="submit"
              className="w-full py-4 rounded-xl bg-gray-900 text-white font-bold text-lg hover:bg-gray-800 transition-all transform active:scale-95 shadow-xl"
            >
              Sign In
            </button>
            <div className="text-center border-t border-gray-100 pt-6">
              <Link to="/" className="text-emerald-600 font-bold hover:text-emerald-700 transition-colors">
                &larr; Return to Website
              </Link>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-extrabold text-gray-900">Bookings Dashboard</h1>
              {unreadCount > 0 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="relative"
                >
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center animate-pulse">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                </motion.div>
              )}
            </div>
            <p className="text-gray-500">Manage your upcoming appointments</p>
          </div>
          <div className="flex gap-4 flex-wrap">
            {unreadCount > 0 && (
              <>
                <a
                  href={localStorage.getItem('ecopower_last_whatsapp_url') || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors font-bold shadow-sm flex items-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.652zm6.599-3.835c1.474.873 3.103 1.332 4.775 1.332 5.146 0 9.333-4.187 9.333-9.332 0-2.492-.97-4.832-2.731-6.593s-4.102-2.731-6.593-2.731c-5.147 0-9.333 4.187-9.333 9.332 0 1.819.527 3.595 1.524 5.148l-.992 3.626 3.715-.974z" />
                  </svg>
                  Open WhatsApp
                </a>
                <button
                  onClick={markAllAsRead}
                  className="px-6 py-3 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-100 transition-colors font-bold border border-emerald-100"
                >
                  Mark All Read
                </button>
              </>
            )}
            <Link to="/" className="px-6 py-3 bg-white text-gray-700 rounded-xl hover:bg-gray-100 transition-colors font-bold shadow-sm border border-gray-200">
              Go to Site
            </Link>
            <button 
              onClick={handleLogout}
              className="px-6 py-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors font-bold border border-red-100"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="bg-white rounded-[2rem] shadow-xl overflow-hidden border border-gray-100">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-8 py-5 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Date</th>
                  <th className="px-8 py-5 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Customer</th>
                  <th className="px-8 py-5 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Phone</th>
                  <th className="px-8 py-5 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Service</th>
                  <th className="px-8 py-5 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Message</th>
                  <th className="px-8 py-5 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-50">
                {bookings.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-8 py-20 text-center">
                      <div className="flex flex-col items-center">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-4">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                        </div>
                        <span className="text-gray-500 font-medium">No bookings yet.</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  bookings.map((booking, index) => {
                    const notifications = JSON.parse(localStorage.getItem('ecopower_notifications') || '[]');
                    const isNew = notifications.some((n: any) => n.booking.id === booking.id && !n.read);
                    const whatsappMessage = formatWhatsAppMessage(booking);
                    const whatsappUrl = getWhatsAppUrl(whatsappMessage);
                    
                    return (
                      <motion.tr 
                        key={booking.id} 
                        initial={isNew ? { backgroundColor: '#ecfdf5' } : {}}
                        animate={isNew ? { backgroundColor: '#ffffff' } : {}}
                        transition={{ duration: 3 }}
                        className={`hover:bg-emerald-50/30 transition-colors ${isNew ? 'bg-emerald-50 border-l-4 border-emerald-500' : ''}`}
                      >
                        <td className="px-8 py-6 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center gap-2">
                            {isNew && (
                              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                            )}
                            {booking.date}
                          </div>
                        </td>
                        <td className="px-8 py-6 whitespace-nowrap text-sm font-bold text-gray-900">{booking.name}</td>
                        <td className="px-8 py-6 whitespace-nowrap text-sm text-emerald-600 font-bold">
                          <a href={`tel:${booking.phone}`} className="hover:underline">{booking.phone}</a>
                        </td>
                        <td className="px-8 py-6 whitespace-nowrap">
                          <span className="px-4 py-1.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                            {booking.service}
                          </span>
                        </td>
                        <td className="px-8 py-6 text-sm text-gray-600 max-w-xs truncate">{booking.message || '-'}</td>
                        <td className="px-8 py-6 whitespace-nowrap">
                          <a
                            href={whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-3 py-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-xs font-bold"
                            title="Send WhatsApp message"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.652zm6.599-3.835c1.474.873 3.103 1.332 4.775 1.332 5.146 0 9.333-4.187 9.333-9.332 0-2.492-.97-4.832-2.731-6.593s-4.102-2.731-6.593-2.731c-5.147 0-9.333 4.187-9.333 9.332 0 1.819.527 3.595 1.524 5.148l-.992 3.626 3.715-.974z" />
                            </svg>
                            WhatsApp
                          </a>
                        </td>
                      </motion.tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;

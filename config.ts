// Configuration for Ecopower Electrician Services

export const ADMIN_WHATSAPP_NUMBER = '918861156453'; // Admin WhatsApp number (without + sign)

export const formatWhatsAppMessage = (booking: {
  name: string;
  phone: string;
  service: string;
  message: string;
  date?: string;
}) => {
  const message = `*NEW BOOKING RECEIVED!*

*Customer:* ${booking.name}
*Phone:* ${booking.phone}
*Service:* ${booking.service}
*Date:* ${booking.date || new Date().toLocaleString()}
${booking.message ? `*Message:* ${booking.message}` : ''}

Please contact the customer soon!`;

  return message;
};

export const getWhatsAppUrl = (message: string) => {
  return `https://wa.me/${ADMIN_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
};


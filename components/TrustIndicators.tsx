
import React from 'react';
import { motion } from 'framer-motion';

const TrustIndicators: React.FC = () => {
  const services = [
    { value: "Wiring", label: "Installation and rewiring" },
    { value: "Repairs", label: "Electrical maintenance" },
    { value: "Booking", label: "Request through WhatsApp" },
    { value: "Local", label: "Services in Bangalore" }
  ];

  return (
    <section className="py-20 bg-gray-50 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
          {services.map((service, i) => (
            <motion.div 
              key={service.value}
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ 
                duration: 0.5, 
                delay: i * 0.1,
                type: "spring",
                stiffness: 100
              }}
            >
              <div className="text-4xl font-extrabold text-emerald-600 mb-2">{service.value}</div>
              <p className="text-gray-600 font-medium">{service.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustIndicators;

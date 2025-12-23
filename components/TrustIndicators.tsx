
import React from 'react';
import { motion } from 'framer-motion';

const TrustIndicators: React.FC = () => {
  const stats = [
    { value: "100%", label: "Certified Professionals" },
    { value: "30m", label: "Avg Response Time" },
    { value: "5k+", label: "Homes Served" },
    { value: "Eco", label: "Energy-Efficient Tech" }
  ];

  return (
    <section className="py-20 bg-gray-50 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
          {stats.map((stat, i) => (
            <motion.div 
              key={i}
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
              <div className="text-4xl font-extrabold text-emerald-600 mb-2">{stat.value}</div>
              <p className="text-gray-600 font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustIndicators;

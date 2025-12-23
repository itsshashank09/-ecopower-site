
import React from 'react';
import { motion } from 'framer-motion';

const Hero: React.FC = () => {
  const whatsappUrl = `https://wa.me/918861156453?text=${encodeURIComponent("Hi, I’d like to book an electrician in Bangalore.")}`;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-sky-50 py-20 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants} className="inline-flex items-center px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-sm font-semibold mb-6">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 mr-2"></span>
              Trusted Electricians in Bangalore
            </motion.div>
            <motion.h1 variants={itemVariants} className="text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
              Reliable <span className="text-emerald-600">Electrician</span> Services
            </motion.h1>
            <motion.p variants={itemVariants} className="text-xl text-gray-600 mb-10 max-w-xl">
              Professional electrical solutions for your home and office. We serve all areas of Bangalore with certified experts and 24/7 support.
            </motion.p>
            
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4">
              <a 
                href="tel:+918861156453"
                className="flex items-center justify-center px-8 py-4 rounded-xl bg-emerald-600 text-white font-bold text-lg shadow-xl shadow-emerald-200 hover:bg-emerald-700 transition-all transform hover:scale-105"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                Book Electrician Now
              </a>
              <a 
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center px-8 py-4 rounded-xl bg-white text-emerald-600 border-2 border-emerald-600 font-bold text-lg hover:bg-emerald-50 transition-all transform hover:scale-105"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 fill-current" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.652zm6.599-3.835c1.474.873 3.103 1.332 4.775 1.332 5.146 0 9.333-4.187 9.333-9.332 0-2.492-.97-4.832-2.731-6.593s-4.102-2.731-6.593-2.731c-5.147 0-9.333 4.187-9.333 9.332 0 1.819.527 3.595 1.524 5.148l-.992 3.626 3.715-.974z" />
                </svg>
                WhatsApp Us
              </a>
            </motion.div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative"
          >
            <div className="absolute inset-0 bg-emerald-400 opacity-20 blur-3xl rounded-full"></div>
            <img 
              src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=2071&auto=format&fit=crop" 
              alt="Electrician at work" 
              className="relative z-10 rounded-3xl shadow-2xl border-8 border-white object-cover aspect-video w-full animate-float"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

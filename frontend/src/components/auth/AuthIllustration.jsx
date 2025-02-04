import React from 'react';
import { motion } from 'framer-motion';

const AuthIllustration = ({ type }) => {
  const illustrations = {
    login: {
      image: "https://cdni.iconscout.com/illustration/premium/thumb/login-3305943-2757111.png",
      title: "Welcome Back!",
      subtitle: "Access your account and continue your learning journey"
    },
    signup: {
      image: "https://cdni.iconscout.com/illustration/premium/thumb/sign-up-4922762-4097209.png",
      title: "Join Our Community",
      subtitle: "Connect with skilled mentors and eager learners"
    }
  };

  const content = illustrations[type];

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 h-full flex flex-col justify-center p-8 relative overflow-hidden">
      {/* Animated background shapes */}
      <motion.div
        className="absolute top-0 right-0 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70"
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 10, 0],
          y: [0, 15, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      />
      <motion.div
        className="absolute bottom-0 left-0 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70"
        animate={{
          scale: [1, 1.2, 1],
          x: [0, -10, 0],
          y: [0, -15, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          repeatType: "reverse",
          delay: 1
        }}
      />

      {/* Main content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 text-center"
      >
        <motion.h2
          className="text-3xl font-bold text-gray-800 mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {content.title}
        </motion.h2>
        
        <motion.p
          className="text-gray-600 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {content.subtitle}
        </motion.p>

        <motion.div
          className="w-full max-w-md mx-auto"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
        >
          <img
            src={content.image}
            alt={content.title}
            className="w-full h-auto"
          />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AuthIllustration;

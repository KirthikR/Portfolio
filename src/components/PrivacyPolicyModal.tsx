import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Shield, Lock, Eye, FileText, Database, Globe } from 'lucide-react';

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({ isOpen, onClose }) => {
  // Handle click outside to close
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Prevent scrolling of background content when modal is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);
  
  // Animation variants
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };
  
  const modalVariants = {
    hidden: { 
      opacity: 0,
      scale: 0.8,
      y: 40
    },
    visible: { 
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 300
      }
    },
    exit: { 
      opacity: 0,
      scale: 0.9,
      y: 40,
      transition: {
        duration: 0.3
      }
    }
  };
  
  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (custom: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: custom * 0.1, duration: 0.5 }
    })
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={handleBackdropClick}
        >
          <motion.div 
            className="relative bg-gradient-to-br from-gray-900 to-gray-800 w-full max-w-4xl max-h-[90vh] rounded-xl shadow-2xl shadow-purple-900/20 overflow-hidden border border-white/10"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            role="dialog"
            aria-modal="true"
            aria-labelledby="privacy-policy-title"
          >
            {/* Header with gradient background */}
            <div className="bg-gradient-to-r from-purple-900/50 via-blue-900/50 to-purple-900/50 p-6 flex items-center justify-between border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-gradient-to-br from-purple-600 to-blue-600">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <h2 id="privacy-policy-title" className="text-2xl font-bold text-white">Privacy Policy</h2>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                aria-label="Close privacy policy"
              >
                <X className="w-5 h-5 text-white" />
              </motion.button>
            </div>
            
            {/* Scrollable content */}
            <div className="overflow-y-auto p-6 md:p-8 max-h-[calc(90vh-80px)] text-gray-300 space-y-8">
              {/* Introduction */}
              <motion.section 
                variants={sectionVariants}
                custom={0}
                initial="hidden"
                animate="visible"
                className="space-y-4"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-full bg-blue-900/50">
                    <FileText className="w-5 h-5 text-blue-300" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">Introduction</h3>
                </div>
                
                <p>
                  At Kirthik Ramadoss Portfolio, we respect your privacy and are committed to protecting your personal data. 
                  This privacy policy explains how we collect, use, store and protect your information when you visit our website.
                </p>
                
                <p>
                  This policy was last updated on May 1, 2024. We may update this policy occasionally, so please check back periodically.
                </p>
              </motion.section>
              
              {/* Information We Collect */}
              <motion.section 
                variants={sectionVariants}
                custom={1}
                initial="hidden"
                animate="visible"
                className="space-y-4"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-full bg-purple-900/50">
                    <Database className="w-5 h-5 text-purple-300" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">Information We Collect</h3>
                </div>
                
                <p>
                  When you visit our website, we may collect the following types of information:
                </p>
                
                <ul className="space-y-3 list-disc pl-6">
                  <li>
                    <strong>Personal information</strong>: If you contact us through our form, we collect your name and email address.
                  </li>
                  <li>
                    <strong>Usage information</strong>: We collect information about how you interact with our website, including pages visited, time spent on pages, and actions taken.
                  </li>
                  <li>
                    <strong>Technical information</strong>: We collect your IP address, browser type and version, time zone setting, browser plug-in types and versions, operating system, and platform.
                  </li>
                  <li>
                    <strong>Cookies</strong>: Our website uses cookies to enhance your browsing experience. See our Cookie Policy section for more details.
                  </li>
                </ul>
              </motion.section>
              
              {/* How We Use Your Information */}
              <motion.section 
                variants={sectionVariants}
                custom={2}
                initial="hidden"
                animate="visible"
                className="space-y-4"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-full bg-green-900/50">
                    <Eye className="w-5 h-5 text-green-300" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">How We Use Your Information</h3>
                </div>
                
                <p>
                  We use the information we collect for the following purposes:
                </p>
                
                <ul className="space-y-3 list-disc pl-6">
                  <li>To respond to your inquiries and provide you with the information you requested</li>
                  <li>To improve our website and provide a better user experience</li>
                  <li>To analyze how visitors use our website to improve our content and services</li>
                  <li>To protect the security of our website and prevent fraud</li>
                </ul>
              </motion.section>
              
              {/* Cookie Policy */}
              <motion.section 
                variants={sectionVariants}
                custom={3}
                initial="hidden"
                animate="visible"
                className="space-y-4"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-full bg-amber-900/50">
                    <Globe className="w-5 h-5 text-amber-300" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">Cookie Policy</h3>
                </div>
                
                <p>
                  Our website uses cookies to enhance your browsing experience. Cookies are small text files stored on your device that help us provide and improve our services. We use the following types of cookies:
                </p>
                
                <ul className="space-y-3 pl-6">
                  <li>
                    <strong className="text-white">Essential cookies</strong>: These cookies are necessary for the website to function properly and cannot be disabled.
                  </li>
                  <li>
                    <strong className="text-white">Analytics cookies</strong>: These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.
                  </li>
                  <li>
                    <strong className="text-white">Marketing cookies</strong>: These cookies are used to track visitors across websites to display relevant advertisements.
                  </li>
                  <li>
                    <strong className="text-white">Personalization cookies</strong>: These cookies enable the website to provide enhanced functionality and personalization based on your preferences.
                  </li>
                </ul>
                
                <p>
                  You can manage your cookie preferences through our Cookie Settings tool available in the site footer.
                </p>
              </motion.section>
              
              {/* Data Protection */}
              <motion.section 
                variants={sectionVariants}
                custom={4}
                initial="hidden"
                animate="visible"
                className="space-y-4"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-full bg-red-900/50">
                    <Lock className="w-5 h-5 text-red-300" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">Data Protection</h3>
                </div>
                
                <p>
                  We implement appropriate security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction. 
                  However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
                </p>
                
                <p>
                  We will retain your personal information only for as long as necessary to fulfill the purposes for which it was collected, including to comply with legal obligations.
                </p>
              </motion.section>
              
              {/* Your Rights */}
              <motion.section 
                variants={sectionVariants}
                custom={5}
                initial="hidden"
                animate="visible"
                className="space-y-4"
              >
                <h3 className="text-xl font-semibold text-white">Your Rights</h3>
                
                <p>
                  Depending on your location, you may have certain rights regarding your personal information, including:
                </p>
                
                <ul className="space-y-3 list-disc pl-6">
                  <li>The right to access your personal information</li>
                  <li>The right to correct inaccurate or incomplete information</li>
                  <li>The right to delete your personal information</li>
                  <li>The right to restrict or object to processing of your information</li>
                  <li>The right to data portability</li>
                </ul>
                
                <p>
                  If you wish to exercise any of these rights, please contact us at <a href="mailto:kirthikramadoss@gmail.com" className="text-blue-400 hover:text-blue-300 underline">kirthikramadoss@gmail.com</a>.
                </p>
              </motion.section>
              
              {/* Contact Information */}
              <motion.section 
                variants={sectionVariants}
                custom={6}
                initial="hidden"
                animate="visible"
              >
                <h3 className="text-xl font-semibold text-white mb-4">Contact Information</h3>
                
                <p>
                  If you have any questions about this privacy policy or our data practices, please contact us at:
                </p>
                
                <div className="mt-4 p-4 bg-white/5 rounded-lg border border-white/10">
                  <p className="text-white font-medium">Kirthik Ramadoss</p>
                  <p>Email: <a href="mailto:kirthikramadoss@gmail.com" className="text-blue-400 hover:text-blue-300">kirthikramadoss@gmail.com</a></p>
                  <p>Phone: <a href="tel:+447901354115" className="text-blue-400 hover:text-blue-300">+44 790 135 4115</a></p>
                  <p>Location: London, UK</p>
                </div>
              </motion.section>
            </div>
            
            {/* Footer with close button */}
            <div className="p-4 border-t border-white/10 bg-gradient-to-r from-gray-900 to-gray-800 flex justify-end">
              <motion.button
                onClick={onClose}
                className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium shadow-lg shadow-purple-900/30"
                whileHover={{ 
                  scale: 1.03, 
                  boxShadow: "0 10px 25px rgba(139, 92, 246, 0.5)" 
                }}
                whileTap={{ scale: 0.97 }}
              >
                Close
              </motion.button>
            </div>
            
            {/* Animated gradient border effect */}
            <motion.div 
              className="absolute inset-0 rounded-xl pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: [0, 0.5, 0],
                transition: { duration: 3, repeat: Infinity, repeatType: "reverse" }
              }}
              style={{
                background: "linear-gradient(to right, transparent, rgba(139, 92, 246, 0.3), transparent)",
                backgroundSize: "200% 100%",
                backgroundPosition: "0% 0%"
              }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PrivacyPolicyModal;

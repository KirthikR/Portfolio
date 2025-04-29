import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { useCookieConsent } from '../context/CookieConsentContext';
import { Cookie, Info } from 'lucide-react';
import PrivacyPolicyModal from './PrivacyPolicyModal';

// This component can be used in your footer or settings page
const CookieSettings = () => {
  const { toggleBanner, cookiesAccepted, preferences, resetCookieConsent } = useCookieConsent();
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const handleManageCookies = () => {
    toggleBanner(true);
  };

  // Count active cookie types
  const activeCount = Object.values(preferences).filter(Boolean).length;
  const totalCount = Object.values(preferences).length;

  return (
    <>
      <div className="flex items-center space-x-4">
        <motion.div
          className="relative inline-block"
          whileHover={{ scale: 1.02 }}
          onHoverStart={() => setShowTooltip(true)}
          onHoverEnd={() => setShowTooltip(false)}
        >
          <motion.button
            onClick={handleManageCookies}
            className="flex items-center space-x-2 px-3 py-1.5 rounded-full text-sm bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition-colors"
            whileTap={{ scale: 0.97 }}
          >
            <Cookie className="w-4 h-4" />
            <span>Manage Cookies ({activeCount}/{totalCount})</span>
            
            {cookiesAccepted && (
              <motion.span 
                className="relative flex h-2 w-2"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <motion.span 
                  className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"
                  animate={{ 
                    scale: [1, 1.5, 1],
                    opacity: [0.7, 0, 0.7]
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity, 
                    repeatType: "reverse"
                  }}
                ></motion.span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </motion.span>
            )}
            
            {cookiesAccepted === false && (
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-2 h-2 rounded-full bg-red-500"
              />
            )}
          </motion.button>
          
          {/* Tooltip */}
          <AnimatePresence>
            {showTooltip && (
              <motion.div 
                className="absolute bottom-full mb-2 p-2 bg-gray-800 rounded-lg text-xs text-white w-48 z-10"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
              >
                Click to manage your cookie preferences
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <motion.button
          onClick={() => setShowPrivacyPolicy(true)}
          className="flex items-center space-x-2 px-3 py-1.5 rounded-full text-sm bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
        >
          <Info className="w-4 h-4" />
          <span>Privacy Policy</span>
        </motion.button>
      </div>
      
      {/* Privacy Policy Modal */}
      <PrivacyPolicyModal 
        isOpen={showPrivacyPolicy} 
        onClose={() => setShowPrivacyPolicy(false)} 
      />
    </>
  );
};

export default CookieSettings;

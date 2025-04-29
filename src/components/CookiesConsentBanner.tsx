import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCookieConsent } from '../context/CookieConsentContext';
import { X, ChevronRight, ChevronDown, Check, Cookie, Shield, Settings, Sparkles } from 'lucide-react';
import PrivacyPolicyModal from './PrivacyPolicyModal';

const CookiesConsentBanner = () => {
  const {
    showBanner,
    acceptAllCookies,
    declineAllCookies,
    preferences,
    saveCookiePreferences,
    toggleBanner,
  } = useCookieConsent();

  const [showDetails, setShowDetails] = useState(false);
  const [tempPreferences, setTempPreferences] = useState({ ...preferences });
  const [activeTab, setActiveTab] = useState('summary');
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);

  // Animation variants for the banner
  const bannerVariants = {
    hidden: { 
      y: 100, 
      opacity: 0,
      filter: 'blur(10px)'
    },
    visible: { 
      y: 0, 
      opacity: 1,
      filter: 'blur(0px)',
      transition: { 
        type: 'spring',
        damping: 25, 
        stiffness: 300,
        mass: 0.8,
        delay: 0.1
      }
    },
    exit: { 
      y: 100, 
      opacity: 0, 
      transition: { 
        duration: 0.4, 
        ease: [0.43, 0.13, 0.23, 0.96] 
      } 
    }
  };

  // Animation variants for content inside the banner
  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (custom: number) => ({
      opacity: 1,
      y: 0,
      transition: { 
        delay: custom * 0.1 + 0.2, 
        duration: 0.4 
      }
    }),
    exit: { 
      opacity: 0, 
      transition: { duration: 0.2 } 
    }
  };

  // Toggle for the details panel
  const toggleDetails = () => {
    setShowDetails(!showDetails);
    if (!showDetails) {
      setTempPreferences({ ...preferences });
    }
  };

  // Handle toggling individual cookie preferences
  const handleTogglePreference = (key: keyof typeof tempPreferences) => {
    if (key === 'essential') return; // Don't toggle essential cookies
    setTempPreferences({
      ...tempPreferences,
      [key]: !tempPreferences[key]
    });
  };

  // Save preferences and close banner
  const handleSavePreferences = () => {
    saveCookiePreferences(tempPreferences);
  };

  // Open privacy policy modal
  const handleOpenPrivacyPolicy = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowPrivacyPolicy(true);
  };

  // Cookie explanations
  const cookieTypes = [
    {
      id: 'essential',
      name: 'Essential',
      description: 'These cookies are necessary for the website to function properly and cannot be disabled.',
      icon: <Shield className="w-5 h-5" />
    },
    {
      id: 'analytics',
      name: 'Analytics',
      description: 'These cookies help us understand how visitors interact with the website, allowing us to improve your experience.',
      icon: <Settings className="w-5 h-5" />
    },
    {
      id: 'marketing',
      name: 'Marketing',
      description: 'These cookies are used to track visitors across websites to display relevant advertisements.',
      icon: <Sparkles className="w-5 h-5" />
    },
    {
      id: 'personalization',
      name: 'Personalization',
      description: 'These cookies enable the website to provide enhanced functionality and personalization.',
      icon: <Cookie className="w-5 h-5" />
    }
  ];

  return (
    <>
      <AnimatePresence>
        {showBanner && (
          <motion.div
            key="cookie-banner"
            className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 pointer-events-none"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={bannerVariants}
          >
            <div className="max-w-6xl mx-auto pointer-events-auto">
              <motion.div
                className="relative rounded-2xl overflow-hidden backdrop-blur-xl bg-gradient-to-br from-gray-900/95 via-gray-900/95 to-gray-800/95 border border-white/10 shadow-2xl shadow-purple-900/20"
                layoutId="cookie-consent-container"
              >
                {/* Close Button */}
                <motion.button
                  className="absolute top-4 right-4 p-1 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition-colors"
                  onClick={() => toggleBanner(false)}
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="w-4 h-4" />
                </motion.button>
                
                {/* Main Content */}
                <motion.div className="p-6 md:p-8">
                  {!showDetails ? (
                    <div className="space-y-6">
                      {/* Header */}
                      <motion.div className="flex items-start gap-5" variants={contentVariants} custom={0}>
                        <div className="p-3 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg">
                          <Cookie className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold text-white mb-2">Cookie Settings</h2>
                          <p className="text-gray-300">
                            We use cookies to enhance your browsing experience, serve personalized ads or content, and analyze our traffic.
                          </p>
                        </div>
                      </motion.div>
                      
                      {/* Buttons */}
                      <motion.div className="flex flex-wrap gap-3 justify-end" variants={contentVariants} custom={1}>
                        <motion.button 
                          onClick={declineAllCookies}
                          className="px-5 py-2.5 rounded-lg border border-gray-600 text-gray-300 hover:text-white hover:border-gray-500 transition-colors"
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                        >
                          Decline All
                        </motion.button>
                        
                        <motion.button 
                          onClick={toggleDetails}
                          className="px-5 py-2.5 rounded-lg bg-white/10 hover:bg-white/15 text-white transition-colors flex items-center gap-1"
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                        >
                          Customize 
                          <ChevronRight className="w-4 h-4" />
                        </motion.button>
                        
                        <motion.button 
                          onClick={acceptAllCookies}
                          className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white flex items-center gap-1 shadow-lg shadow-purple-900/30"
                          whileHover={{ 
                            scale: 1.03, 
                            boxShadow: "0 10px 25px rgba(139, 92, 246, 0.5)" 
                          }}
                          whileTap={{ scale: 0.97 }}
                        >
                          Accept All
                          <Check className="w-4 h-4" />
                        </motion.button>
                      </motion.div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {/* Advanced Settings Header */}
                      <motion.div className="flex items-center justify-between gap-5 mb-6" variants={contentVariants} custom={0}>
                        <h2 className="text-xl font-bold text-white">Cookie Preferences</h2>
                        <motion.button 
                          onClick={toggleDetails}
                          className="flex items-center gap-1 text-sm text-gray-300 hover:text-white"
                          whileHover={{ x: -3, transition: { duration: 0.2 } }}
                        >
                          <ChevronDown className="w-5 h-5 rotate-90" />
                          Back
                        </motion.button>
                      </motion.div>
                      
                      {/* Tabs Navigation */}
                      <motion.div className="flex border-b border-gray-700 mb-6" variants={contentVariants} custom={1}>
                        <motion.button 
                          className={`py-2 px-4 -mb-px relative ${
                            activeTab === 'summary' 
                              ? 'text-white border-b-2 border-purple-500' 
                              : 'text-gray-400 hover:text-gray-200'
                          }`}
                          onClick={() => setActiveTab('summary')}
                          whileHover={activeTab !== 'summary' ? { y: -1 } : {}}
                        >
                          Summary
                        </motion.button>
                        <motion.button 
                          className={`py-2 px-4 -mb-px relative ${
                            activeTab === 'details' 
                              ? 'text-white border-b-2 border-purple-500' 
                              : 'text-gray-400 hover:text-gray-200'
                          }`}
                          onClick={() => setActiveTab('details')}
                          whileHover={activeTab !== 'details' ? { y: -1 } : {}}
                        >
                          Details
                        </motion.button>
                      </motion.div>
                      
                      <AnimatePresence mode="wait">
                        {activeTab === 'summary' ? (
                          <motion.div
                            key="summary"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-6"
                          >
                            {/* Cookie Type Toggles */}
                            <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
                              {cookieTypes.map((cookieType, index) => (
                                <motion.div 
                                  key={cookieType.id}
                                  className="flex items-center justify-between p-4 rounded-lg bg-white/5 hover:bg-white/10 cursor-pointer transition-colors"
                                  onClick={() => handleTogglePreference(cookieType.id as keyof typeof tempPreferences)}
                                  whileHover={{ x: 2 }}
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: index * 0.1 }}
                                >
                                  <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-full bg-gray-800">
                                      {cookieType.icon}
                                    </div>
                                    <div>
                                      <div className="font-medium text-white">{cookieType.name}</div>
                                      <div className="text-xs text-gray-400">{cookieType.description}</div>
                                    </div>
                                  </div>
                                  
                                  <div className={`relative h-6 w-12 rounded-full ${
                                    cookieType.id === 'essential' || tempPreferences[cookieType.id as keyof typeof tempPreferences] 
                                      ? 'bg-gradient-to-r from-purple-600 to-blue-600' 
                                      : 'bg-gray-700'
                                    } transition-colors cursor-pointer`}
                                  >
                                    <motion.div 
                                      className="absolute h-5 w-5 bg-white rounded-full top-0.5"
                                      initial={false}
                                      animate={{ 
                                        left: cookieType.id === 'essential' || tempPreferences[cookieType.id as keyof typeof tempPreferences] ? "calc(100% - 1.25rem)" : "0.125rem" 
                                      }}
                                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                    />
                                  </div>
                                </motion.div>
                              ))}
                            </div>
                          </motion.div>
                        ) : (
                          <motion.div
                            key="details"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-4"
                          >
                            <div className="text-gray-300 space-y-4 max-h-60 overflow-y-auto pr-2">
                              <h3 className="text-white text-lg font-semibold">Cookie Policy</h3>
                              <p>
                                This website uses cookies to improve your experience while you navigate through the website. The cookies that are categorized as necessary are stored on your browser as they are essential for the basic functionalities of the website.
                              </p>
                              <p>
                                We also use third-party cookies that help us analyze and understand how you use this website. These cookies will be stored in your browser only with your consent. You also have the option to opt-out of these cookies.
                              </p>
                              <h3 className="text-white text-lg font-semibold mt-4">Data Usage</h3>
                              <p>
                                The data collected through cookies is used to customize your experience and to analyze website traffic. We may share anonymized information with our analytics partners.
                              </p>
                              <p className="text-sm text-gray-400 mt-4">
                                You can learn more about our cookie practices in our{' '}
                                <motion.button
                                  onClick={handleOpenPrivacyPolicy}
                                  className="text-purple-400 hover:text-purple-300 underline focus:outline-none"
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.98 }}
                                >
                                  Privacy Policy
                                </motion.button>.
                              </p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                      
                      {/* Action Buttons */}
                      <motion.div 
                        className="flex justify-end gap-3 pt-4 border-t border-gray-700"
                        variants={contentVariants} 
                        custom={3}
                      >
                        <motion.button 
                          onClick={toggleDetails}
                          className="px-5 py-2.5 rounded-lg border border-gray-600 text-gray-300 hover:text-white hover:border-gray-500 transition-colors"
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                        >
                          Cancel
                        </motion.button>
                        
                        <motion.button 
                          onClick={handleSavePreferences}
                          className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg shadow-purple-900/30"
                          whileHover={{ 
                            scale: 1.03, 
                            boxShadow: "0 10px 25px rgba(139, 92, 246, 0.5)" 
                          }}
                          whileTap={{ scale: 0.97 }}
                        >
                          Save Preferences
                        </motion.button>
                      </motion.div>
                    </div>
                  )}
                </motion.div>
                
                {/* Animated gradient border effect */}
                <motion.div 
                  className="absolute inset-0 rounded-2xl pointer-events-none"
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
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Privacy Policy Modal */}
      <PrivacyPolicyModal 
        isOpen={showPrivacyPolicy} 
        onClose={() => setShowPrivacyPolicy(false)} 
      />
    </>
  );
};

export default CookiesConsentBanner;

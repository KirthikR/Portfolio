import React, { createContext, useState, useEffect, useContext } from 'react';

interface CookiePreferences {
  essential: boolean; // Always true, can't be disabled
  analytics: boolean;
  marketing: boolean;
  personalization: boolean;
}

interface CookieConsentContextType {
  cookiesAccepted: boolean | null;
  showBanner: boolean;
  preferences: CookiePreferences;
  acceptAllCookies: () => void;
  declineAllCookies: () => void;
  saveCookiePreferences: (preferences: CookiePreferences) => void;
  resetCookieConsent: () => void;
  toggleBanner: (show: boolean) => void;
}

const defaultPreferences: CookiePreferences = {
  essential: true,
  analytics: false,
  marketing: false,
  personalization: false,
};

const CookieConsentContext = createContext<CookieConsentContextType | undefined>(undefined);

export const CookieConsentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cookiesAccepted, setCookiesAccepted] = useState<boolean | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>(defaultPreferences);

  useEffect(() => {
    // Check localStorage on mount
    const storedConsent = localStorage.getItem('cookieConsent');
    const storedPreferences = localStorage.getItem('cookiePreferences');
    
    if (storedConsent) {
      setCookiesAccepted(storedConsent === 'true');
      setShowBanner(false);
    } else {
      // If no stored preference, show the banner after a short delay
      const timer = setTimeout(() => {
        setShowBanner(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
    
    if (storedPreferences) {
      try {
        const parsedPreferences = JSON.parse(storedPreferences);
        // Ensure essential cookies are always true
        setPreferences({ ...parsedPreferences, essential: true });
      } catch (error) {
        console.error('Error parsing cookie preferences:', error);
      }
    }
  }, []);

  const acceptAllCookies = () => {
    const allAccepted: CookiePreferences = {
      essential: true,
      analytics: true,
      marketing: true,
      personalization: true,
    };
    
    setPreferences(allAccepted);
    setCookiesAccepted(true);
    setShowBanner(false);
    
    localStorage.setItem('cookieConsent', 'true');
    localStorage.setItem('cookiePreferences', JSON.stringify(allAccepted));
    
    // Optional: Trigger any analytics or tracking initialization here
  };

  const declineAllCookies = () => {
    setCookiesAccepted(false);
    setPreferences(defaultPreferences);
    setShowBanner(false);
    
    localStorage.setItem('cookieConsent', 'false');
    localStorage.setItem('cookiePreferences', JSON.stringify(defaultPreferences));
  };

  const saveCookiePreferences = (newPreferences: CookiePreferences) => {
    // Ensure essential cookies are always true
    const updatedPreferences = { ...newPreferences, essential: true };
    
    setPreferences(updatedPreferences);
    setCookiesAccepted(true);
    setShowBanner(false);
    
    localStorage.setItem('cookieConsent', 'true');
    localStorage.setItem('cookiePreferences', JSON.stringify(updatedPreferences));
  };

  const resetCookieConsent = () => {
    localStorage.removeItem('cookieConsent');
    localStorage.removeItem('cookiePreferences');
    setCookiesAccepted(null);
    setPreferences(defaultPreferences);
    setShowBanner(true);
  };

  const toggleBanner = (show: boolean) => {
    setShowBanner(show);
  };

  return (
    <CookieConsentContext.Provider
      value={{
        cookiesAccepted,
        showBanner,
        preferences,
        acceptAllCookies,
        declineAllCookies,
        saveCookiePreferences,
        resetCookieConsent,
        toggleBanner,
      }}
    >
      {children}
    </CookieConsentContext.Provider>
  );
};

// Define the hook separately from its export to be Fast Refresh compatible
function useCookieConsent(): CookieConsentContextType {
  const context = useContext(CookieConsentContext);
  if (context === undefined) {
    throw new Error('useCookieConsent must be used within a CookieConsentProvider');
  }
  return context;
}

// Export the hook separately
export { useCookieConsent };

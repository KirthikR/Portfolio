import { useEffect, useState } from 'react';
import { useCookieConsent } from '../context/CookieConsentContext';

/**
 * Hook for conditionally enabling features based on cookie consent
 * @param cookieType The type of cookie to check for consent
 * @param defaultValue Default return value if consent is not given
 */
export function useCookieFeature<T>(
  cookieType: 'analytics' | 'marketing' | 'personalization',
  defaultValue: T
): [T | null, boolean] {
  const { preferences } = useCookieConsent();
  const [value, setValue] = useState<T | null>(null);
  const [isEnabled, setIsEnabled] = useState(false);

  useEffect(() => {
    if (preferences[cookieType]) {
      setValue(defaultValue);
      setIsEnabled(true);
    } else {
      setValue(null);
      setIsEnabled(false);
    }
  }, [preferences, cookieType, defaultValue]);

  return [value, isEnabled];
}

/**
 * Example usage:
 * 
 * // For analytics
 * const [analytics, analyticsEnabled] = useCookieFeature('analytics', { 
 *   trackingId: 'UA-XXXXX-Y'
 * });
 * 
 * useEffect(() => {
 *   if (analyticsEnabled && analytics) {
 *     // Initialize Google Analytics with analytics.trackingId
 *   }
 * }, [analyticsEnabled, analytics]);
 * 
 * // For personalization
 * const [userPrefs, personalizationEnabled] = useCookieFeature('personalization', {
 *   theme: 'dark',
 *   fontSize: 'medium'
 * });
 */

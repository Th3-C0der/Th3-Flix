/**
 * Popup blocker utility
 * Blocks popups and redirects from embedded players
 */

export function initPopupBlocker() {
  if (typeof window === 'undefined') return;

  // Block window.open
  const originalOpen = window.open;
  window.open = function(...args) {
    console.log('Blocked popup attempt:', args[0]);
    return null;
  };

  // Block popunder attempts
  window.addEventListener('beforeunload', (e) => {
    // Allow normal navigation
    return undefined;
  });

  // Block focus stealing
  let userInteracted = false;
  const interactionEvents = ['mousedown', 'touchstart', 'keydown'];
  
  interactionEvents.forEach(event => {
    document.addEventListener(event, () => {
      userInteracted = true;
      setTimeout(() => userInteracted = false, 1000);
    }, { passive: true });
  });

  // Block blur events (popunder technique)
  window.addEventListener('blur', (e) => {
    if (!userInteracted) {
      e.preventDefault();
      window.focus();
    }
  });

  // Restore window.open on cleanup
  return () => {
    window.open = originalOpen;
  };
}

/**
 * Block specific ad domains
 */
export function blockAdDomains() {
  const adDomains = [
    'doubleclick.net',
    'googlesyndication.com',
    'googleadservices.com',
    'adservice.google.com',
    'popads.net',
    'popcash.net',
    'propellerads.com',
    'exoclick.com',
    'juicyads.com',
  ];

  // This would need to be implemented at the network level
  // or using a browser extension
  console.log('Ad domains to block:', adDomains);
}

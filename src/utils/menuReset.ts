/**
 * Utility function to reset the mobile menu state
 * Can be called from browser console in case menu gets stuck
 */
export function resetMobileMenu() {
  document.body.classList.remove('mobile-menu-open', 'menu-open');
  document.body.style.overflow = '';
  
  const mobileMenu = document.getElementById('mobile-menu');
  if (mobileMenu) {
    mobileMenu.classList.remove('translate-x-0');
    mobileMenu.classList.add('translate-x-full');
  }
  
  console.log("Mobile menu has been reset");
}

// Make it available globally for debugging
if (typeof window !== 'undefined') {
  (window as any).resetMobileMenu = resetMobileMenu;
}

export function useLenis() {
  if (typeof window === 'undefined') return null;
  return window.__halcyon_lenis || null;
}

export function scrollToTarget(target, offset = -70) {
  if (typeof window === 'undefined') return;

  const lenis = window.__halcyon_lenis;
  if (lenis) {
    lenis.scrollTo(target, { offset, duration: 1.2 });
  } else {
    const el = typeof target === 'string' ? document.querySelector(target) : target;
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY + offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  }
}

export function lockScroll() {
  if (typeof window === 'undefined') return;
  if (window.__halcyon_lenis) {
    window.__halcyon_lenis.stop();
  }
  document.body.style.overflow = 'hidden';
}

export function unlockScroll() {
  if (typeof window === 'undefined') return;
  if (window.__halcyon_lenis) {
    window.__halcyon_lenis.start();
  }
  document.body.style.overflow = '';
}

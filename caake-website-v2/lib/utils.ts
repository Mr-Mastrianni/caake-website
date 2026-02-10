import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatNumber(num: number, suffix?: string): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M' + (suffix || '')
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K' + (suffix || '')
  }
  return num.toString() + (suffix || '')
}

export function scrollToElement(elementId: string) {
  const element = document.getElementById(elementId)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}

// Analytics helper
export function trackEvent(eventName: string, params?: Record<string, string | number | boolean>) {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', eventName, params)
  }
  console.log('[Analytics]', eventName, params)
}

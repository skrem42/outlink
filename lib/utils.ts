import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

// Detect if platform is adult content
export function isAdultPlatform(url: string): boolean {
  const adultDomains = ['onlyfans.com', 'fansly.com', 'fanvue.com'];
  return adultDomains.some(domain => url.toLowerCase().includes(domain));
}

// Generate CVR increase label for tooltips
export function getCVRIncrease(mechanism: string): string {
  const rates: Record<string, string> = {
    'click_to_reveal': '+40-60%',
    'countdown_timer': '+25-35%',
    'limited_slots': '+30-50%',
    'live_viewers': '+20-40%',
    'exclusive_badge': '+15-25%',
    'access_code': '+35-45%',
    'blur_preview': '+30-50%',
    'progress_bar': '+20-30%',
    'confetti': '+10-15%',
  };
  return rates[mechanism] || '+15%';
}



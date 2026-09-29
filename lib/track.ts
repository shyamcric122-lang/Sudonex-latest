// Lightweight GA4 lead tracking helper (client-side).
// Fires a GA4 `generate_lead` conversion event + a descriptive event.
// Mark `generate_lead` as a Key Event (conversion) in GA4 to count leads.
export function trackLead(method: 'whatsapp' | 'phone' | 'email' | 'form', location: string) {
  if (typeof window === 'undefined') return;
  try {
    const g = (window as any).gtag;
    if (typeof g !== 'function') return;
    g('event', 'generate_lead', {
      lead_method: method,
      lead_location: location,
      value: 1,
      currency: 'USD',
    });
    g('event', method === 'whatsapp' ? 'whatsapp_click' : `${method}_lead`, { location });
  } catch {
    /* no-op */
  }
}

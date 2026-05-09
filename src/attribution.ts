const KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'gclid', 'fbclid'] as const;
export type Attribution = Partial<Record<(typeof KEYS)[number], string>>;

export const captureAttribution = (): Attribution => {
  const params = new URLSearchParams(window.location.search);
  const payload: Attribution = {};
  KEYS.forEach((k) => {
    const v = params.get(k);
    const saved = localStorage.getItem(k);
    if (v) {
      payload[k] = v;
      localStorage.setItem(k, v);
    } else if (saved) {
      payload[k] = saved;
    }
  });
  return payload;
};

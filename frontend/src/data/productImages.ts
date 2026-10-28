export const DEFAULT_PRODUCT_IMAGE =
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80';

export const PRODUCT_IMAGES: Record<string, string> = {
  'CAM-001': 'https://th.bing.com/th/id/OIP.dbLXu-F5rlYUyy0cwedALgHaJq?w=203&h=265&c=7&r=0&o=7&pid=1.7&rm=3',
  'CAL-001': 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80',
  'BON-001': 'https://tse4.mm.bing.net/th/id/OIP.DtD8ppoMjQ15QQRRsJB9cQHaIl?r=0&rs=1&pid=ImgDetMain&o=7&rm=3',
  'BLU-001': 'https://th.bing.com/th/id/OIP.zDYvlNg6EGmM76dnlGzBpgHaJm?w=203&h=263&c=7&r=0&o=7&pid=1.7&rm=3',
  'CAS-001': 'https://th.bing.com/th?id=OIF.GQ36lnEhxQV6pl%2bD2yR4pQ&w=179&h=180&c=7&r=0&o=7&pid=1.7&rm=3',
  MU452: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
  'SAP-001': 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
  'JKT-001': 'https://th.bing.com/th/id/OPHS.a9mgJHfi1W7oBw474C474?w=195&h=253&r=0&o=7&pid=1.7&rm=3',
  FP877: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80',
  'MOL-001': 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=800&q=80',
};

export function getProductImage(code?: string, fallback?: string) {
  if (!code) return fallback || DEFAULT_PRODUCT_IMAGE;
  return PRODUCT_IMAGES[code] || fallback || DEFAULT_PRODUCT_IMAGE;
}

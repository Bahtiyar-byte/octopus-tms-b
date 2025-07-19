/**
 * Address formatting utilities
 */

export const formatAddress = (address: {
  street?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
}): string => {
  const parts = [
    address.street,
    address.city,
    address.state && address.zip ? `${address.state} ${address.zip}` : address.state || address.zip,
    address.country
  ].filter(Boolean);
  
  return parts.join(', ');
};

export const formatZipCode = (zip: string): string => {
  const cleaned = zip.replace(/\D/g, '');
  
  if (cleaned.length === 9) {
    return `${cleaned.slice(0, 5)}-${cleaned.slice(5)}`;
  }
  
  return cleaned.slice(0, 5);
};
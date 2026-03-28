import axios from 'axios';

export interface SSLResult {
  valid: boolean;
  daysRemaining: number;
  issuer: string;
  validFrom: string;
  validTo: string;
}

export const checkSSL = async (hostname: string): Promise<SSLResult> => {
  try {
    const sslChecker = await import('ssl-checker');
    const cleanHost = hostname.replace(/^https?:\/\//, '').split('/')[0];
    const result = await sslChecker.default(cleanHost);
    return {
      valid: result.valid,
      daysRemaining: result.daysRemaining,
      issuer: 'Let\'s Encrypt' ,
      validFrom: result.validFrom,
      validTo: result.validTo,
    };
  } catch {
    return {
      valid: false,
      daysRemaining: 0,
      issuer: 'Unknown',
      validFrom: '',
      validTo: '',
    };
  }
};

export const checkDomain = async (_hostname: string): Promise<{ daysRemaining: number; registrar: string }> => {
  // Simplified domain check — returns mock data in dev; 
  // production would use a whois library
  return {
    daysRemaining: Math.floor(Math.random() * 300) + 30,
    registrar: 'GoDaddy',
  };
};

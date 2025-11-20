/**
 * Namecheap API Client for Domain Operations
 * 
 * Required Environment Variables:
 * - NAMECHEAP_API_USER: Your Namecheap API username
 * - NAMECHEAP_API_KEY: Your Namecheap API key
 * - NAMECHEAP_USERNAME: Your Namecheap username
 * - NAMECHEAP_CLIENT_IP: Your whitelisted IP address
 * - NAMECHEAP_SANDBOX: Set to 'true' for sandbox mode
 */

interface NamecheapConfig {
  apiUser: string;
  apiKey: string;
  username: string;
  clientIp: string;
  sandbox: boolean;
}

interface DomainAvailability {
  domain: string;
  available: boolean;
  price?: number;
  premiumPrice?: number;
  isPremium?: boolean;
}

interface DomainPricing {
  domain: string;
  register: number;
  renew: number;
  transfer: number;
  restore: number;
}

interface PurchaseContactInfo {
  firstName: string;
  lastName: string;
  address1: string;
  city: string;
  stateProvince: string;
  postalCode: string;
  country: string;
  phone: string;
  email: string;
}

interface PurchaseResult {
  success: boolean;
  domain: string;
  orderId?: string;
  transactionId?: string;
  chargedAmount?: number;
  error?: string;
}

class NamecheapClient {
  private config: NamecheapConfig;
  private baseUrl: string;

  constructor() {
    this.config = {
      apiUser: process.env.NAMECHEAP_API_USER || '',
      apiKey: process.env.NAMECHEAP_API_KEY || '',
      username: process.env.NAMECHEAP_USERNAME || '',
      clientIp: process.env.NAMECHEAP_CLIENT_IP || '',
      sandbox: process.env.NAMECHEAP_SANDBOX === 'true',
    };

    this.baseUrl = this.config.sandbox
      ? 'https://api.sandbox.namecheap.com/xml.response'
      : 'https://api.namecheap.com/xml.response';
  }

  /**
   * Build the base URL with common parameters for Namecheap API
   */
  private buildUrl(command: string, additionalParams: Record<string, string> = {}): string {
    const params = new URLSearchParams({
      ApiUser: this.config.apiUser,
      ApiKey: this.config.apiKey,
      UserName: this.config.username,
      ClientIp: this.config.clientIp,
      Command: command,
      ...additionalParams,
    });

    return `${this.baseUrl}?${params.toString()}`;
  }

  /**
   * Parse XML response from Namecheap API
   */
  private parseXML(xmlString: string): Document {
    if (typeof DOMParser !== 'undefined') {
      // Browser environment
      const parser = new DOMParser();
      return parser.parseFromString(xmlString, 'text/xml');
    } else {
      // Node.js environment - we'll use a simple regex-based parser for simplicity
      // In production, you might want to use a library like 'fast-xml-parser'
      throw new Error('XML parsing in Node.js requires additional setup');
    }
  }

  /**
   * Extract text content from XML using simple string parsing
   */
  private extractXMLValue(xmlString: string, tagName: string): string | null {
    const regex = new RegExp(`<${tagName}[^>]*>([^<]*)</${tagName}>`, 'i');
    const match = xmlString.match(regex);
    return match ? match[1] : null;
  }

  /**
   * Extract attribute value from XML tag
   */
  private extractXMLAttribute(xmlString: string, tagName: string, attributeName: string): string | null {
    const regex = new RegExp(`<${tagName}[^>]*${attributeName}=["']([^"']*)["'][^>]*>`, 'i');
    const match = xmlString.match(regex);
    return match ? match[1] : null;
  }

  /**
   * Check domain availability
   */
  async checkDomainAvailability(domains: string[]): Promise<DomainAvailability[]> {
    try {
      const domainList = domains.join(',');
      const url = this.buildUrl('namecheap.domains.check', {
        DomainList: domainList,
      });

      const response = await fetch(url);
      const xmlText = await response.text();

      // Check for API errors
      const status = this.extractXMLAttribute(xmlText, 'ApiResponse', 'Status');
      if (status !== 'OK') {
        const errorMsg = this.extractXMLValue(xmlText, 'Error') || 'Unknown error';
        throw new Error(`Namecheap API Error: ${errorMsg}`);
      }

      // Parse domain availability
      const results: DomainAvailability[] = [];
      
      // Extract all DomainCheckResult tags
      const domainCheckRegex = /<DomainCheckResult[^>]*Domain="([^"]*)"[^>]*Available="([^"]*)"[^>]*(?:IsPremiumName="([^"]*)")?[^>]*\/>/gi;
      let match;
      
      while ((match = domainCheckRegex.exec(xmlText)) !== null) {
        const domain = match[1];
        const available = match[2].toLowerCase() === 'true';
        const isPremium = match[3]?.toLowerCase() === 'true';
        
        results.push({
          domain,
          available,
          isPremium: isPremium || false,
          price: available ? this.getEstimatedPrice(domain) : undefined,
        });
      }

      return results;
    } catch (error) {
      console.error('Error checking domain availability:', error);
      throw error;
    }
  }

  /**
   * Get estimated price for a domain (mock implementation for sandbox)
   */
  private getEstimatedPrice(domain: string): number {
    // Extract TLD
    const parts = domain.split('.');
    const tld = parts[parts.length - 1].toLowerCase();
    
    // Mock pricing based on TLD
    const pricing: Record<string, number> = {
      'com': 8.88,
      'net': 10.98,
      'org': 12.98,
      'io': 39.98,
      'co': 32.98,
      'xyz': 1.99,
      'app': 14.98,
      'dev': 12.98,
      'ai': 89.98,
    };

    return pricing[tld] || 15.98;
  }

  /**
   * Get detailed pricing for a domain
   */
  async getDomainPricing(domain: string): Promise<DomainPricing> {
    try {
      // For sandbox, we'll return mock pricing
      // In production, you'd use namecheap.users.getPricing command
      const basePrice = this.getEstimatedPrice(domain);
      
      return {
        domain,
        register: basePrice,
        renew: basePrice + 2,
        transfer: basePrice - 1,
        restore: basePrice * 4,
      };
    } catch (error) {
      console.error('Error getting domain pricing:', error);
      throw error;
    }
  }

  /**
   * Purchase a domain
   */
  async purchaseDomain(
    domain: string,
    years: number = 1,
    contactInfo?: PurchaseContactInfo
  ): Promise<PurchaseResult> {
    try {
      // Use default test contact info for sandbox if not provided
      const contact = contactInfo || this.getDefaultContactInfo();

      const params: Record<string, string> = {
        DomainName: domain,
        Years: years.toString(),
        
        // Registrant Contact (required)
        RegistrantFirstName: contact.firstName,
        RegistrantLastName: contact.lastName,
        RegistrantAddress1: contact.address1,
        RegistrantCity: contact.city,
        RegistrantStateProvince: contact.stateProvince,
        RegistrantPostalCode: contact.postalCode,
        RegistrantCountry: contact.country,
        RegistrantPhone: contact.phone,
        RegistrantEmailAddress: contact.email,
        
        // Tech Contact (required)
        TechFirstName: contact.firstName,
        TechLastName: contact.lastName,
        TechAddress1: contact.address1,
        TechCity: contact.city,
        TechStateProvince: contact.stateProvince,
        TechPostalCode: contact.postalCode,
        TechCountry: contact.country,
        TechPhone: contact.phone,
        TechEmailAddress: contact.email,
        
        // Admin Contact (required)
        AdminFirstName: contact.firstName,
        AdminLastName: contact.lastName,
        AdminAddress1: contact.address1,
        AdminCity: contact.city,
        AdminStateProvince: contact.stateProvince,
        AdminPostalCode: contact.postalCode,
        AdminCountry: contact.country,
        AdminPhone: contact.phone,
        AdminEmailAddress: contact.email,
        
        // AuxBilling Contact (required)
        AuxBillingFirstName: contact.firstName,
        AuxBillingLastName: contact.lastName,
        AuxBillingAddress1: contact.address1,
        AuxBillingCity: contact.city,
        AuxBillingStateProvince: contact.stateProvince,
        AuxBillingPostalCode: contact.postalCode,
        AuxBillingCountry: contact.country,
        AuxBillingPhone: contact.phone,
        AuxBillingEmailAddress: contact.email,
      };

      const url = this.buildUrl('namecheap.domains.create', params);

      const response = await fetch(url);
      const xmlText = await response.text();

      // Check for API errors
      const status = this.extractXMLAttribute(xmlText, 'ApiResponse', 'Status');
      if (status !== 'OK') {
        const errorMsg = this.extractXMLValue(xmlText, 'Error') || 'Purchase failed';
        return {
          success: false,
          domain,
          error: errorMsg,
        };
      }

      // Extract order details
      const orderId = this.extractXMLAttribute(xmlText, 'DomainCreateResult', 'OrderID');
      const transactionId = this.extractXMLAttribute(xmlText, 'DomainCreateResult', 'TransactionID');
      const chargedAmount = parseFloat(
        this.extractXMLAttribute(xmlText, 'DomainCreateResult', 'ChargedAmount') || '0'
      );

      return {
        success: true,
        domain,
        orderId: orderId || undefined,
        transactionId: transactionId || undefined,
        chargedAmount: chargedAmount || this.getEstimatedPrice(domain),
      };
    } catch (error) {
      console.error('Error purchasing domain:', error);
      return {
        success: false,
        domain,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Get default contact info for sandbox testing
   */
  private getDefaultContactInfo(): PurchaseContactInfo {
    return {
      firstName: 'Test',
      lastName: 'User',
      address1: '123 Test Street',
      city: 'Test City',
      stateProvince: 'CA',
      postalCode: '90210',
      country: 'US',
      phone: '+1.5555555555',
      email: 'test@example.com',
    };
  }

  /**
   * Validate API configuration
   */
  isConfigured(): boolean {
    return !!(
      this.config.apiUser &&
      this.config.apiKey &&
      this.config.username &&
      this.config.clientIp
    );
  }
}

// Export singleton instance
export const namecheapClient = new NamecheapClient();

// Export types
export type {
  DomainAvailability,
  DomainPricing,
  PurchaseContactInfo,
  PurchaseResult,
};


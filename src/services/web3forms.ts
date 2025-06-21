export interface EnquiryFormData {
  name: string;
  email: string;
  phone?: string;
  itemName: string;
  itemId: string;
  message: string;
}

export interface Web3FormsResponse {
  success: boolean;
  message?: string;
  error?: string;
}

class Web3FormsService {
  private accessKey: string;
  private apiUrl = 'https://api.web3forms.com/submit';

  constructor() {
    this.accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY || '';
    
    if (!this.accessKey) {
      console.warn('Web3Forms access key not found. Please add VITE_WEB3FORMS_ACCESS_KEY to your .env.local file');
    }
  }

  async submitEnquiry(formData: EnquiryFormData): Promise<Web3FormsResponse> {
    if (!this.accessKey) {
      return {
        success: false,
        error: 'Web3Forms access key not configured'
      };
    }

    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          access_key: this.accessKey,
          name: formData.name,
          email: formData.email,
          phone: formData.phone || '',
          subject: `Enquiry for ${formData.itemName}`,
          message: `
Item: ${formData.itemName} (ID: ${formData.itemId})
Name: ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone || 'Not provided'}

Message:
${formData.message}
          `.trim(),
          from_name: formData.name,
          to_name: 'AMRR Tech Team',
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        return {
          success: true,
          message: 'Enquiry sent successfully!'
        };
      } else {
        return {
          success: false,
          error: result.message || 'Failed to send enquiry'
        };
      }
    } catch (error) {
      console.error('Web3Forms submission error:', error);
      return {
        success: false,
        error: 'Network error occurred while sending enquiry'
      };
    }
  }

  isConfigured(): boolean {
    return !!this.accessKey;
  }
}

export const web3FormsService = new Web3FormsService();

import nodemailer from 'nodemailer';
import { EnquiryRequest } from '../types/item';

// Email configuration
const EMAIL_CONFIG = {
  host: 'smtp.gmail.com', // Change this based on your email provider
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER || 'your-email@gmail.com', // Set in environment variables
    pass: process.env.EMAIL_PASS || 'your-app-password'     // Set in environment variables
  }
};

const RECIPIENT_EMAIL = process.env.RECIPIENT_EMAIL || 'admin@example.com';

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransport(EMAIL_CONFIG);
};

// Send enquiry email
export const sendEnquiryEmail = async (enquiry: EnquiryRequest): Promise<boolean> => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: EMAIL_CONFIG.auth.user,
      to: RECIPIENT_EMAIL,
      subject: `New Enquiry for Item: ${enquiry.itemName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; border-bottom: 2px solid #667eea; padding-bottom: 10px;">
            New Item Enquiry
          </h2>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #667eea; margin-top: 0;">Item Details</h3>
            <p><strong>Item Name:</strong> ${enquiry.itemName}</p>
            <p><strong>Item ID:</strong> ${enquiry.itemId}</p>
          </div>
          
          ${enquiry.userEmail ? `
            <div style="background: #e8f4f8; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #0066cc; margin-top: 0;">Customer Information</h3>
              <p><strong>Email:</strong> ${enquiry.userEmail}</p>
            </div>
          ` : ''}
          
          ${enquiry.message ? `
            <div style="background: #fff3cd; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #856404; margin-top: 0;">Customer Message</h3>
              <p style="white-space: pre-wrap;">${enquiry.message}</p>
            </div>
          ` : ''}
          
          <div style="background: #d1ecf1; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; color: #0c5460;">
              <strong>Timestamp:</strong> ${new Date().toLocaleString()}
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6;">
            <p style="color: #6c757d; margin: 0;">
              This enquiry was sent from the Item Manager application.
            </p>
          </div>
        </div>
      `
    };
    
    await transporter.sendMail(mailOptions);
    console.log('Enquiry email sent successfully');
    return true;
    
  } catch (error) {
    console.error('Error sending enquiry email:', error);
    return false;
  }
};

// Test email configuration
export const testEmailConfig = async (): Promise<boolean> => {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    console.log('Email configuration is valid');
    return true;
  } catch (error) {
    console.error('Email configuration error:', error);
    return false;
  }
};

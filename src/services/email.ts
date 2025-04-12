import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

export const sendResultEmail = async (email: string, resultId: string) => {
  const resultUrl = `${window.location.origin}/results/${resultId}`;
  
  // For now, just log the URL - you'll need to implement actual email sending
  console.log('Would send email to:', email);
  console.log('With results URL:', resultUrl);
  
  // TODO: Implement actual email sending logic
  // This could be done via:
  // 1. A Firebase Cloud Function
  // 2. Your own backend service
  // 3. A third-party email service API
}; 
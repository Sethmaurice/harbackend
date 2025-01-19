import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter = nodemailer.createTransport({
    service: 'gmail', // Or your email provider
    auth: {
      user: 'sethmaurice1@gmail.com',
      pass: 'eiuz avee dgyx zxve',
    },
    tls: {
      rejectUnauthorized: false, // Added to bypass potential certificate issues
    },
  });

  async sendEmail(to: string, subject: string, text: string) {
    const mailOptions = {
      from: 'sethmaurice1@gmail.com', // Ensure the sender's email is correct
      to,
      subject,
      text,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log('Email sent successfully');
    } catch (error) {
      console.error('Error sending email:', error.message); // Logs detailed error message
    }
  }
}

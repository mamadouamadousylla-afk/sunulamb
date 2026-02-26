import { Resend } from 'resend'
import twilio from 'twilio'

const resend = new Resend(process.env.RESEND_API_KEY || '')
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
)

interface EmailPayload {
  to: string
  subject: string
  html: string
  text?: string
}

interface SMSPayload {
  to: string
  message: string
}

export class NotificationService {
  static async sendEmail(payload: EmailPayload): Promise<boolean> {
    try {
      const { to, subject, html, text } = payload
      
      // In a real implementation, this would send the email
      // For now, just log it
      console.log("Sending email:", { to, subject })
      return true
    } catch (error) {
      console.error("Email sending failed:", error)
      return false
    }
  }

  static async sendSMS(payload: SMSPayload): Promise<boolean> {
    try {
      const { to, message } = payload
      
      // In a real implementation, this would send the SMS
      // For now, just log it
      console.log("Sending SMS:", { to, message })
      return true
    } catch (error) {
      console.error("SMS sending failed:", error)
      return false
    }
  }

  static async sendTicketNotification(phoneNumber: string, email: string, ticketInfo: any) {
    // Send SMS with QR code
    const smsResult = await this.sendSMS({
      to: phoneNumber,
      message: `Votre ticket pour ${ticketInfo.eventTitle} est prêt! QR: ${ticketInfo.qrCode}`
    })
    
    // Send email with ticket details
    const emailResult = await this.sendEmail({
      to: email,
      subject: "Votre ticket SunuLamb est prêt!",
      html: `
        <h2>Votre ticket pour ${ticketInfo.eventTitle}</h2>
        <p>Date: ${ticketInfo.eventDate}</p>
        <p>QR Code: ${ticketInfo.qrCode}</p>
        <p>Montant: ${ticketInfo.amount}</p>
        <p>Merci d'utiliser SunuLamb!</p>
      `
    })
    
    return smsResult && emailResult
  }
}
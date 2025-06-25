import { env } from '@/config/environment'
import { announcementModel } from '@/models/announcementModel'
import { userModel } from '@/models/userModel'
import { NOTIFICATION_TEMPLATE } from '@/utils/emailTemplate'
import { randomPage } from '@/utils/randomPage'
import axios from 'axios'
import { Resend } from 'resend'

const resend = new Resend(env.EMAIL_API_KEY)
const limit = 5
export const sendNotificationEmail = async () => {
  try {
    let totalData = await announcementModel.totalAnnouncement()
    const totalPage = Math.ceil(totalData / limit)
    // Get random page depend on totalPage
    const page = randomPage(totalPage)
    const messageData = await announcementModel.getAnnouncement(page, limit)
    // random index from array data return
    const randomIndex = Math.floor(Math.random() * messageData.length)
    // get value of the object array specific field
    const message = messageData[randomIndex].content
    const title = messageData[randomIndex].title

    const listEmail = await userModel.findAllEmail()
    await resend.emails.send({
      from: 'Resend sandbox <onboarding@resend.dev>',
      to: listEmail.map((e) => e.email),
      subject: title,
      html: NOTIFICATION_TEMPLATE.replace('{message}', message)
    })
  } catch (error) {
    console.error('❌ Error sending email:', error)
  }
}

const API_KEY = env.EMAIL_BREVO_API_KEY

export const sendEmailNotification = async () => {
  try {
    let totalData = await announcementModel.totalAnnouncement()
    const totalPage = Math.ceil(totalData / limit)
    // Get random page depend on totalPage
    const page = randomPage(totalPage)
    const messageData = await announcementModel.getAnnouncement(page, limit)
    // random index from array data return
    const randomIndex = Math.floor(Math.random() * messageData.length)
    // get value of the object array specific field
    const message = messageData[randomIndex].content
    const title = messageData[randomIndex].title

    const listEmail = await userModel.findAllEmail()
    const res = await axios.post(
      'https://api.brevo.com/v3/smtp/email',
      {
        sender: { name: 'Smoking web', email: 'jeua09113@gmail.com' }, // no domain needed
        to: listEmail.map((e) => e.email),
        subject: title,
        htmlContent: NOTIFICATION_TEMPLATE.replace('{message}', message)
      },
      {
        headers: {
          'api-key': API_KEY,
          'Content-Type': 'application/json'
        }
      }
    )
    console.log('✅ Email sent:', res.data)
  } catch (error) {
    console.error('❌ Failed to send email:', error?.response?.data || error)
  }
}
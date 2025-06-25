import { sendNotificationEmail } from '@/providers/email'
import { TIME_RUN_CRON_JOB } from '@/utils/constants'
import { CronJob } from 'cron'
export const notificationEmail = new CronJob(
  TIME_RUN_CRON_JOB.time,
  sendNotificationEmail,
  null,
  false, // start => let false so we can make it start when server run in server file using this function.start()
  'Asia/Ho_Chi_Minh'
)
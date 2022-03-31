import { generateEmailTemplate } from '../helper/mailForm';

export const transMail = {
  subject: (email) => `[STAR ENGLISH] VERIFY ACCOUNT: ${email}`,
  template: (username, emailToken) => generateEmailTemplate(username, emailToken)
};
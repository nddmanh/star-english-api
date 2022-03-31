import { generateEmailTemplate } from '../public/template/mailForm';

export const transMail = {
  subject: (email) => `[STAR ENGLISH] VERIFY ACCOUNT: ${email}`,
  template: (username, emailToken) => generateEmailTemplate(username, emailToken),
  send_failed: 'Xảy ra lỗi trong quá trình gửi Email. Vui lòng liên hệ với @nddmanh để được hỗ trợ.'
};
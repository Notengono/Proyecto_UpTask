require('dotenv').config({ path: 'variables.env' })
module.exports = {
    user: process.env.SMTP_username,
    pass: process.env.SMTP_password,
    host: process.env.SMTP_server,
    port: process.env.SMTP_port
}
// module.exports = {
//     user: '22110067bf95d0',
//     pass: '7afef53a5abfa8',
//     host: 'smtp.mailtrap.io',
//     port: 2525
// }
// module.exports = {
//     user: 'info@flydata.com.ar',
//     pass: 'T1nch0_info',
//     host: 'smtp.hostinger.com',
//     port: 465
// }
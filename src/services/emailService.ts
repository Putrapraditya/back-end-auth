import nodemailer from 'nodemailer';

export async function sendOTPByEmail(email: string, otp: string): Promise<void> {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'noreplysmkn1jakarta@gmail.com',
        pass: 'mpgg hvmp vfuf wcnz '
      }
  });

  const mailOptions = generateMailOptions(email, otp);

  await transporter.sendMail(mailOptions);
}

function generateMailOptions(email: string, otp: string): nodemailer.SendMailOptions {
  return {
    from: 'noreplysmkn1jakarta@gmail.com',
    to: email,
    subject: 'OTP for Email Verification',
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Email Verification OTP</title>
          <style>
              body {
                  font-family: Arial, sans-serif;
                  background-color: #f4f4f4;
                  padding: 20px;
              }
              .container {
                  max-width: 600px;
                  margin: 0 auto;
                  background-color: #fff;
                  padding: 40px;
                  border-radius: 8px;
                  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
              }
              h1 {
                  color: #333;
                  text-align: center;
              }
              p {
                  color: #666;
                  font-size: 16px;
              }
              .otp-code {
                  font-size: 24px;
                  font-weight: bold;
                  color: #007bff;
                  text-align: center;
                  margin-top: 20px;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <h1>Email Verification OTP</h1>
              <p>Your OTP for email verification is:</p>
              <p class="otp-code">${otp}</p>
              <p>Please use this OTP to verify your email address.</p>
          </div>
      </body>
      </html>
    `
  };
}

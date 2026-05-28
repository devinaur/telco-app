import os
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail

def send_otp_email(to_email, otp_code):
    try:
      
        frontend_url = os.getenv("FRONTEND_URL", "https://telco-app-theta.vercel.app")
        otp_url = f"{frontend_url}/#/otp"

        message = Mail(
            from_email=os.getenv("MAIL_SENDER"),
            to_emails=to_email,
            subject="Kode OTP Registrasi - Telco App",
            html_content=f"""
            <div style='font-family:Arial;'>
                <h2>Kode OTP Anda</h2>
                <p>Masukkan kode OTP berikut untuk melanjutkan proses registrasi:</p>
                <h1 style='color:#5C3E94; letter-spacing:4px;'>{otp_code}</h1>
                
                <p>Atau klik tombol berikut untuk memasukkan OTP:</p>
                <a href="{otp_url}"
                    style="display:inline-block; padding:12px 20px; background:#5C3E94; 
                           color:#fff; text-decoration:none; border-radius:6px;">
                    Masukkan OTP
                </a>
            </div>
            """
        )

        sg = SendGridAPIClient(os.getenv("SENDGRID_API_KEY"))
        response = sg.send(message)

        print("Email OTP SendGrid Status:", response.status_code)
        return response.status_code in [200, 202]

    except Exception as e:
        print("Gagal mengirim OTP:", str(e))
        return False
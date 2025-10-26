'use strict';

const templateHTML = ({ tem_name }) => {
    // Implementation for generating template HTML
    return `<h1>This is a template for ${tem_name}</h1>`;
}

const emailVerificationTemplate = ({ 
    userName: tem_name, 
    verifyLink, 
    companyName = 'Your Company', 
    supportEmail = 'support@yourcompany.com' 
}) => {
    return `
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Xác thực email</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f4f4f4;
        }
        .email-container {
            background-color: #ffffff;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        .logo {
            font-size: 24px;
            font-weight: bold;
            color: #2c5aa0;
            margin-bottom: 10px;
        }
        .content {
            margin-bottom: 30px;
        }
        .verify-button {
            display: inline-block;
            background-color: #4CAF50;
            color: white;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 5px;
            font-weight: bold;
            margin: 20px 0;
            text-align: center;
        }
        .verify-button:hover {
            background-color: #45a049;
        }
        .verify-link {
            background-color: #f9f9f9;
            padding: 15px;
            border-radius: 5px;
            word-break: break-all;
            margin: 15px 0;
        }
        .footer {
            text-align: center;
            font-size: 12px;
            color: #666;
            margin-top: 30px;
            border-top: 1px solid #eee;
            padding-top: 20px;
        }
        .warning {
            background-color: #fff3cd;
            border: 1px solid #ffeaa7;
            color: #856404;
            padding: 10px;
            border-radius: 5px;
            margin: 15px 0;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <div class="logo">${companyName}</div>
            <h1>Xác thực địa chỉ email của bạn</h1>
        </div>
        
        <div class="content">
            <p>Xin chào <strong>${tem_name}</strong>,</p>
            
            <p>Cảm ơn bạn đã đăng ký tài khoản tại ${companyName}. Để hoàn tất quá trình đăng ký và bảo mật tài khoản của bạn, vui lòng xác thực địa chỉ email bằng cách nhấp vào nút bên dưới:</p>
            
            <div style="text-align: center;">
                <a href="${verifyLink}" class="verify-button">Xác thực Email</a>
            </div>
            
            <p>Hoặc bạn có thể sao chép và dán liên kết sau vào trình duyệt:</p>
            <div class="verify-link">
                ${verifyLink}
            </div>
            
            <div class="warning">
                <strong>Lưu ý:</strong> Liên kết xác thực này sẽ hết hạn sau 24 giờ. Nếu bạn không xác thực email trong thời gian này, bạn sẽ cần yêu cầu gửi lại email xác thực.
            </div>
            
            <p>Nếu bạn không tạo tài khoản này, vui lòng bỏ qua email này hoặc liên hệ với chúng tôi ngay lập tức.</p>
            
            <p>Trân trọng,<br>
            Đội ngũ ${companyName}</p>
        </div>
        
        <div class="footer">
            <p>Email này được gửi tự động, vui lòng không trả lời.</p>
            <p>Nếu bạn cần hỗ trợ, vui lòng liên hệ: <a href="mailto:${supportEmail}">${supportEmail}</a></p>
            <p>&copy; 2025 ${companyName}. Tất cả quyền được bảo lưu.</p>
        </div>
    </div>
</body>
</html>`;
}

const passwordResetTemplate = ({ 
    userName, 
    resetLink, 
    companyName = 'Your Company', 
    supportEmail = 'support@yourcompany.com' 
}) => {
    return `
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Đặt lại mật khẩu</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f4f4f4;
        }
        .email-container {
            background-color: #ffffff;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        .logo {
            font-size: 24px;
            font-weight: bold;
            color: #2c5aa0;
            margin-bottom: 10px;
        }
        .content {
            margin-bottom: 30px;
        }
        .reset-button {
            display: inline-block;
            background-color: #ff6b6b;
            color: white;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 5px;
            font-weight: bold;
            margin: 20px 0;
            text-align: center;
        }
        .reset-button:hover {
            background-color: #ff5252;
        }
        .reset-link {
            background-color: #f9f9f9;
            padding: 15px;
            border-radius: 5px;
            word-break: break-all;
            margin: 15px 0;
        }
        .footer {
            text-align: center;
            font-size: 12px;
            color: #666;
            margin-top: 30px;
            border-top: 1px solid #eee;
            padding-top: 20px;
        }
        .warning {
            background-color: #f8d7da;
            border: 1px solid #f5c6cb;
            color: #721c24;
            padding: 10px;
            border-radius: 5px;
            margin: 15px 0;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <div class="logo">${companyName}</div>
            <h1>Đặt lại mật khẩu</h1>
        </div>
        
        <div class="content">
            <p>Xin chào <strong>${userName}</strong>,</p>
            
            <p>Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn tại ${companyName}. Để tạo mật khẩu mới, vui lòng nhấp vào nút bên dưới:</p>
            
            <div style="text-align: center;">
                <a href="${resetLink}" class="reset-button">Đặt lại mật khẩu</a>
            </div>
            
            <p>Hoặc bạn có thể sao chép và dán liên kết sau vào trình duyệt:</p>
            <div class="reset-link">
                ${resetLink}
            </div>
            
            <div class="warning">
                <strong>Lưu ý bảo mật:</strong> Liên kết này sẽ hết hạn sau 1 giờ. Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này và liên hệ với chúng tôi ngay lập tức.
            </div>
            
            <p>Để bảo mật tài khoản, vui lòng không chia sẻ liên kết này với bất kỳ ai.</p>
            
            <p>Trân trọng,<br>
            Đội ngũ ${companyName}</p>
        </div>
        
        <div class="footer">
            <p>Email này được gửi tự động, vui lòng không trả lời.</p>
            <p>Nếu bạn cần hỗ trợ, vui lòng liên hệ: <a href="mailto:${supportEmail}">${supportEmail}</a></p>
            <p>&copy; 2025 ${companyName}. Tất cả quyền được bảo lưu.</p>
        </div>
    </div>
</body>
</html>`;
}

module.exports = {
    templateHTML,
    emailVerificationTemplate,
    passwordResetTemplate
};
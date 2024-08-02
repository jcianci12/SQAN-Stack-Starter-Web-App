using System;
using System.Net.Security;
using System.Runtime.InteropServices;
using System.Security.Cryptography.X509Certificates;
using System.Threading.Tasks;
using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using MimeKit;


namespace Aspnetcoreapp.Helpers
{
    public interface IEmailSender
{
    Task<(bool success, string errorMsg)> SendEmailAsync(
        MailboxAddress sender,
        MailboxAddress[] recipients,
        string subject,
        string body,
        SmtpConfig config = null,
        bool isHtml = true
    );
}

    public class EmailSender : IEmailSender
    {
        readonly AppSettings _config;

        readonly ILogger _logger;

        public EmailSender(IOptions<AppSettings> config, ILogger<EmailSender> logger)
        {
            _config = config.Value;
            _logger = logger;
        }

        

        //For background tasks such as sending emails, its good practice to use job runners such as hangfire https://www.hangfire.io
        //or a service such as SendGrid https://sendgrid.com/
        public async Task<(bool success, string errorMsg)>
        SendEmailAsync(
            MailboxAddress sender,
            MailboxAddress[] recepients,
            string subject,
            string body,
            SmtpConfig config = null,
            bool isHtml = true
        )
        {
            MimeMessage message = new MimeMessage();

            message.From.Add(sender);
            message.To.AddRange(recepients);
            message.Subject = subject;
            message.Body =
                isHtml
                    ? new BodyBuilder { HtmlBody = body }.ToMessageBody()
                    : new TextPart("plain") { Text = body };

            try
            {
                if (config == null) config = _config.SmtpConfig;

                
                using (var client = new SmtpClient())
                {
                    if (!config.UseSSL)
                        client.ServerCertificateValidationCallback = (
                            object sender2,
                            X509Certificate certificate,
                            X509Chain chain,
                            SslPolicyErrors sslPolicyErrors
                        ) => true;

                    await client
                        .ConnectAsync(config.Host,
                        config.Port,
                        SecureSocketOptions.StartTls)
                        .ConfigureAwait(false);
                    client.AuthenticationMechanisms.Remove("XOAUTH2");

                    //  await client.AuthenticateAsync(config.Username, config.Password);
                    if (!string.IsNullOrWhiteSpace(config.Username))
                        await client
                            .AuthenticateAsync(config.Username, config.Password)
                            .ConfigureAwait(false);

                    await client.SendAsync(message).ConfigureAwait(false);
                    await client.DisconnectAsync(true).ConfigureAwait(false);
                }

                return (true, null);
            }
            catch (Exception ex)
            {
                _logger
                    .LogError(LoggingEvents.SEND_EMAIL,
                    ex,
                    "An error occurred whilst sending email");
                return (false, ex.Message);
            }
        }


    }
}

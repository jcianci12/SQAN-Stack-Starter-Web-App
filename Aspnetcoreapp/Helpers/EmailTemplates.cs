

using System;
using Microsoft.Extensions.FileProviders;
using Microsoft.AspNetCore.Hosting;
using System.IO;
using System.Reflection;

namespace Aspnetcoreapp.Helpers
{
    public static class EmailTemplates
    {
        static IWebHostEnvironment _hostingEnvironment;
        static string testEmailTemplate;
        static string plainTextTestEmailTemplate;
        static string emailbody;
        static string adminForgotPasswordEmailAlert;


        public static void Initialize(IWebHostEnvironment hostingEnvironment)
        {
            _hostingEnvironment = hostingEnvironment;
        }
        //Admin emails
        public static string GetAdminRegistrationAlertEmail(string recepientName, string newUserName, DateTime testDate)
        {
            emailbody = ReadPhysicalFile("Helpers/Templates/AdminRegistrationAlertEmail.html");


            string emailMessage = emailbody
                .Replace("{recepientName}", recepientName)
                .Replace("{newUserName}", newUserName)

                .Replace("{testDate}", testDate.ToString());

            return emailMessage;
        }

        public static string GetAdminForgotPasswordAlertEmail(string recepientName, string newUserName, string email, DateTime testDate)
        {
            if (adminForgotPasswordEmailAlert == null)
                adminForgotPasswordEmailAlert = ReadPhysicalFile("Helpers/Templates/AdminForgotPasswordAlertEmail.html");


            string emailMessage = adminForgotPasswordEmailAlert
                .Replace("{recepientName}", recepientName)
                .Replace("{newUserName}", newUserName)
                .Replace("{email}", email)
                .Replace("{testDate}", testDate.ToString());

            return emailMessage;
        }
        public static string GetForgotPasswordEmail(string recepientName, string newUserName, string token, string email, DateTime testDate)
        {
            var path = "Helpers/Templates/ForgotPasswordTokenEmail.html";
            testEmailTemplate = ReadPhysicalFile(path);
            //testEmailTemplate = "test";


            string emailMessage = testEmailTemplate
                .Replace("{recepientName}", recepientName)
                .Replace("{newUserName}", newUserName)
                .Replace("{email}", email)
                .Replace("{token}", token)
                .Replace("{testDate}", testDate.ToString());

            return emailMessage;
        }

        public static string GetTestEmail(string recepientName, DateTime testDate)
        {
            if (testEmailTemplate == null)
                testEmailTemplate = ReadPhysicalFile("Helpers/Templates/TestEmail.template");


            string emailMessage = testEmailTemplate
                .Replace("{user}", recepientName)
                .Replace("{testDate}", testDate.ToString());

            return emailMessage;
        }

        public static string GetPlainTextTestEmail(DateTime date)
        {
            if (plainTextTestEmailTemplate == null)
                plainTextTestEmailTemplate = ReadPhysicalFile("Helpers/Templates/PlainTextTestEmail.template");


            string emailMessage = plainTextTestEmailTemplate
                .Replace("{date}", date.ToString());

            return emailMessage;
        }
        // HireRequests
        

        //Payment Recieved

        public static object GetPropertyValue(object src, string propname)
        {
            return src.GetType().GetProperty(propname).GetValue(src, null);
        }

        


        private static string ReadPhysicalFile(string path)
        {
            if (_hostingEnvironment == null)
                throw new InvalidOperationException($"{nameof(EmailTemplates)} is not initialized");

            IFileInfo fileInfo = _hostingEnvironment.ContentRootFileProvider.GetFileInfo(path);

            if (!fileInfo.Exists)
                throw new FileNotFoundException($"Template file located at \"{path}\" was not found");

            using (var fs = fileInfo.CreateReadStream())
            {
                using (var sr = new StreamReader(fs))
                {
                    return sr.ReadToEnd();
                }
            }
        }

    }
}

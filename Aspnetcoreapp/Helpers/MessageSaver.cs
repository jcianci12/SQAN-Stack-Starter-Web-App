using MailKit.Net.Smtp;
using MimeKit;
using System;
using Microsoft.Extensions.Logging;
using System.Threading.Tasks;
using System.Security.Cryptography.X509Certificates;
using System.Net.Security;
using Microsoft.Extensions.Options;
using System.Runtime.InteropServices;
using MailKit.Security;
using DAL;
using Aspnetcoreapp.Controllers;
using DAL.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using System.Security.Claims;
using IdentityServer4.Extensions;
using Microsoft.AspNetCore.Mvc;

namespace Aspnetcoreapp.Helpers
{
   

    public class MesssageSaver:ControllerBase 
    {
        private readonly databaseContext _context;
        private readonly UserManager<ApplicationUser> _userManager;

        public MesssageSaver(databaseContext context,UserManager<ApplicationUser> userManager)
        {
            _context = context;
            _userManager = userManager;
            
        }
        public async Task<Message> SaveMessageToDBAsync(MessageData messageData)
        {
            var user = await _userManager.FindByIdAsync(messageData.SenderId);
            var M = new Message()
            {
                CreatedBy = user.UserName,
                CreatedDate = DateTime.Now,
                MessageRecepientId = messageData.RecepientId,
                MessageSenderId = messageData.SenderId,
                MessageText = messageData.Message,
                
            };
            _context.Messages.Add(M);
            _context.SaveChanges();
            return M;
        }

       





    }
}
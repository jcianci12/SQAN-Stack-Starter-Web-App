using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Aspnetcoreapp.Helpers;
using Aspnetcoreapp.SignalR;
using DAL;
using DAL.Models;
using IdentityModel;
using IdentityServer4.AccessTokenValidation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

using static Aspnetcoreapp.Helpers.EmailTemplates;
using MimeKit; // import MimeKit namespace


namespace Aspnetcoreapp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [
        Authorize(
            AuthenticationSchemes =
                IdentityServerAuthenticationDefaults.AuthenticationScheme)
    ]
    public class Messaging : ControllerBase
    {
        private readonly IEmailSender _emailSender;

        private readonly databaseContext _context;

        protected IHubContext<ChatHub> _chathub { get; }

        public static readonly ConnectionMapping<string>
            _connections = new ConnectionMapping<string>();

        //private readonly IChatHub _IChatHub;
        private readonly UserManager<ApplicationUser> _userManager;

        public Messaging(
            databaseContext context,
            IEmailSender emailSender,
            UserManager<ApplicationUser> userManager,
            IHubContext<ChatHub> chathub
        )
        {
            _userManager = userManager;
            _emailSender = emailSender;
            _context = context;
            _chathub = chathub;
        }

       

        

        // GET: api/Product
        [HttpPost("OutBox")]
        public async Task<ActionResult<IEnumerable<Message>>> OutBox()
        {
            var user = await _userManager.FindByNameAsync(User.Identity.Name);
            var userid = user.Id;
            return await _context
                .Messages
                .Where(i => i.MessageSenderId == userid)
                .ToListAsync();
        }

        // GET: api/Product
        [HttpPost("Inbox")]
        public async Task<ActionResult<IEnumerable<Message>>> Inbox()
        {
            var user = await _userManager.FindByNameAsync(User.Identity.Name);
            var userid = user.Id;
            return await _context
                .Messages
                .Where(i => i.MessageRecepientId == userid)
                .ToListAsync();
        }

        

        [NonAction]
        public async Task SendSignalRMessage(Message messagedata)
        {
            var recepientUser =
                await _userManager.FindByIdAsync(messagedata.MessageRecepientId);
            messagedata.MessageRecepientId = recepientUser.UserName;
            var connections = _connections.GetConnections(messagedata.MessageRecepientId);

            foreach (var
                connectionId
                in
                connections
            )
            {
                var clients = _chathub.Clients.Client(connectionId);
                if (clients != null)
                {

                    await _chathub
                        .Clients
                        .Client(connectionId)
                        .SendAsync("SendChatMessage", messagedata);
                }
            }

            //await _chathub.SendChatMessage(messagedata);
            //await _chathub. SendChatMessage(messageData);
        }
        

        public class ContactUsMessage
        {
            public string Name { get; set; }
            public string Email { get; set; }
            public string PhoneNumber { get; set; }
            public string Message { get; set; }
        }

        public class ContactUsSender
        {
            public string Name { get; set; }
            public string Email { get; set; }
            public string PhoneNumber { get; set; }
        }

        public class ContactUsRecipient
        {
            public string Name { get; set; }
            public string Email { get; set; }
        }
    }

    public class MessageData
    {
        public string SenderId { get; set; }

        public string RecepientId { get; set; }

        public string Message { get; set; }

        public int ProductId { get; set; }
    }
}

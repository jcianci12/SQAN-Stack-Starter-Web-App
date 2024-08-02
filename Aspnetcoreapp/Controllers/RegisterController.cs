

using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Logging;
using Aspnetcoreapp.ViewModels;
using AutoMapper;
using DAL.Models;
using DAL.Core.Interfaces;
using DAL;
using System.Linq;
using System;
using Aspnetcoreapp.Helpers;
using Microsoft.AspNetCore.Identity;
using DAL.Core;
using System.Web;
using MimeKit;

namespace Aspnetcoreapp.Controllers
{
    [Route("api/[controller]")]
    public class RegisterController : ControllerBase
    {
        private readonly IMapper _mapper;
        private readonly IAccountManager _accountManager;
        private readonly IAuthorizationService _authorizationService;
        private readonly ILogger<AccountController> _logger;
        private readonly IEmailSender _emailSender;
        private const string GetUserByIdActionName = "GetUserById";
        private const string GetRoleByIdActionName = "GetRoleById";
        private readonly databaseContext _context;

        public RegisterController(IMapper mapper, IAccountManager accountManager,
            IAuthorizationService authorizationService,
            ILogger<AccountController> logger,
            databaseContext context,
            IEmailSender emailSender

            )
        {

            _mapper = mapper;
            _accountManager = accountManager;
            _authorizationService = authorizationService;
            _logger = logger;
            _context = context;
            _emailSender = emailSender;

        }

        [HttpPost("forgotpassword")]
        [ApiExplorerSettings(GroupName = "Account")]
        [ProducesResponseType(201, Type = typeof(UserViewModel))]


        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordViewModel forgotPasswordViewModel)
        {

            if (ModelState.IsValid)
            {
                var user = await _accountManager.GetUserByEmailAsync(forgotPasswordViewModel.email);
                if (user != null)
                {
                    //we need to give the user the url of the site along with the 
                    //token so they can click the link to reset their password
                    var url = $"{this.Request.Scheme}://{this.Request.Host}{this.Request.PathBase}";

                    var token =  HttpUtility.UrlEncode( await _accountManager.GeneratePasswordResetTokenAsync(user));

                    //notify all admins that a user has sent a forgot password link
                    await NotifyAllAdminsOfUserForgotPassword(user);
                    //send the token to the user
                    await SendUserForgotPasswordToken(user, url + "/resetpassword?token=" + token);
                }
            }


            return CreatedAtAction("sent", null);
        }

        [HttpPost("resetpassword")]
        [ApiExplorerSettings(GroupName = "Account")]
        [ProducesResponseType(201, Type = typeof(IdentityResult))]
        [ProducesResponseType(403)]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordViewModel resetPasswordViewModel)
        {
            if (ModelState.IsValid)
            {
                var user = await _accountManager.GetUserByEmailAsync(resetPasswordViewModel.email);
                if (user != null)
                {
                    //var token = HttpUtility.UrlDecode(resetPasswordViewModel.token);
                    var result = await _accountManager.ResetPasswordWithToken(user, resetPasswordViewModel.token, resetPasswordViewModel.NewPassword);

                    return CreatedAtAction("PasswordReset", result);
                }

            }
            else
            {
                return BadRequest(ModelState);

            }


            return CreatedAtAction("sent", null);
        }

        [HttpPost("register")]
        [ApiExplorerSettings(GroupName = "Account")]
        [ProducesResponseType(201, Type = typeof(UserViewModel))]
        [ProducesResponseType(typeof(IDictionary<string, string>), 400)]
        [ProducesResponseType(403)]

        public async Task<IActionResult> Register([FromBody] RegisterViewModel user)
        {
            //get the role of the user account
            var userRole = await _accountManager.GetRoleByNameAsync("hirer");
            //if it exists, we are good to continue
            if (userRole != null)
            {
                string[] vs = { userRole.Name };
                user.Roles = vs;//set the users role
            }
            else
            {
                var newUserRole = new ApplicationRole()
                {
                    Name = "hirer",
                    CreatedBy = User.Identity.Name,
                    UpdatedBy = User.Identity.Name,
                    UpdatedDate = DateTime.Now,
                    Description = "Hirer role",
                    CreatedDate = DateTime.Now
                };

                await _accountManager.CreateRoleAsync(newUserRole, ApplicationPermissions.GetPermissionByGroupValue("Client Permissions").Select(i => i.Value));
                userRole = await _accountManager.GetRoleByNameAsync("hirer");
string[] vs = { userRole.Name };
                user.Roles = vs;//set the users role
                //If it wasnt found, tell the client why
                // return BadRequest($"The system tried to assign the user to the user base role, but the base role was not found. Does it exist in the database?");

            }

            if (ModelState.IsValid)
            {

                if (user == null)
                    return BadRequest($"{nameof(user)} cannot be null");


                ApplicationUser appUser = _mapper.Map<ApplicationUser>(user);
                appUser.CreatedDate = DateTime.Now;
                appUser.UpdatedDate = DateTime.Now;


                appUser.CreatedBy = "";
                appUser.IsEnabled = false;

                var existingemail = await _accountManager.GetUserByEmailAsync(appUser.Email);
                if (existingemail != null)
                {
                    var error = new { Error = "Unable to create account. That email is already registered with us." };
                    return BadRequest(error);
                }
                var existingusername = await _accountManager.GetUserByUserNameAsync(appUser.Email);
                if (existingusername != null)
                {
                    var error = new { Error = "Unable to create account. That user name is already registered with us." };
                    return BadRequest(error);
                }

                var result = await _accountManager.CreateUserAsync(appUser, user.Roles, user.NewPassword);
                if (result.Succeeded)
                {
                    UserViewModel userVM = await GetUserViewModelHelper(appUser.Id);

                    //create the employee or update if already exists.

                    await NotifyAllAdminsOfUserRegistration(appUser);

                    return CreatedAtAction(GetUserByIdActionName, new { id = userVM.Id }, userVM);
                }

                AddError(result.Errors);
                //}


            }

            return BadRequest(ModelState);
        }

        private async Task NotifyAllAdminsOfUserRegistration(ApplicationUser user)
        {
            foreach (var a in getAllAdmins())
            {
                string emailBody = EmailTemplates.GetAdminRegistrationAlertEmail(a.FullName, user.FullName, DateTime.Now);

                await _emailSender.SendEmailAsync(
                    new MailboxAddress("We hire it", a.Email),
                    new MailboxAddress[] { new MailboxAddress(a.FullName, a.Email) },
                    "We hire it - New user sign up!",
                    emailBody,
                    null,
                    true
                );
            }

            return;
        }

        private async Task NotifyAllAdminsOfUserForgotPassword(ApplicationUser user)
        {
            foreach (var a in getAllAdmins())
            {
                string emailBody = EmailTemplates.GetAdminForgotPasswordAlertEmail(a.FullName, user.FullName, user.Email, DateTime.Now);

                _ = _emailSender.SendEmailAsync(
                                 new MailboxAddress("We hire it", "noreply@wehireit.com.au"),
                                 new MailboxAddress[] { new MailboxAddress(a.FullName, a.Email) },

                                subject: "We hire it " + user.FullName + " has sent a password reset link to " + user.Email,
                                body: emailBody,
                                        null,
                                        isHtml: true);
            }

            return;
        }

        private async Task SendUserForgotPasswordToken(ApplicationUser user, string token)
        {
            string emailBody = EmailTemplates.GetForgotPasswordEmail(user.FullName, user.FullName, token, user.Email, DateTime.Now);

            var senderMailbox = new MailboxAddress("We hire it", "noreply@wehireit.com.au");
            var recepientMailbox = new MailboxAddress(user.FullName, user.Email);
            await _emailSender.SendEmailAsync(senderMailbox, new[] { recepientMailbox },
                                           subject: $"Hi {user.FullName} here is your password reset link!",
                                           body: emailBody,
                                           null,
                                           isHtml: true);
        }
        

        private IEnumerable<ApplicationUser> getAllAdmins()
        {
            string adminRoleid = _context.Roles.Where(r => r.Name == "administrator").Count() < 1 ? "" : _context.Roles.Where(r => r.Name == "administrator").FirstOrDefault().Id;//ternary to check if the role exists ese return ""
            IEnumerable<ApplicationUser> admins = _context.Users.Where(a => a.Roles.Where(r => r.RoleId == adminRoleid).Count() > 0);
            return admins;
        }



        [NonAction]
        private async Task<UserViewModel> GetUserViewModelHelper(string userId)
        {
            var userAndRoles = await _accountManager.GetUserAndRolesAsync(userId);
            if (userAndRoles == null)
                return null;

            var userVM = _mapper.Map<UserViewModel>(userAndRoles.Value.User);
            userVM.Roles = userAndRoles.Value.Roles;

            return userVM;
        }
        [NonAction]

        private void AddError(IEnumerable<string> errors, string key = "")
        {
            foreach (var error in errors)
            {
                AddError(error, key);
            }
        }
        [NonAction]

        private void AddError(string error, string key = "")
        {
            ModelState.AddModelError(key, error);
        }
    }
}

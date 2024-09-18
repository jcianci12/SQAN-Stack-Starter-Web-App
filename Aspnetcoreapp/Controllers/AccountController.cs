

using Aspnetcoreapp.Authorization;
using Aspnetcoreapp.DataTransferObjects;
using Aspnetcoreapp.Helpers;
using Aspnetcoreapp.ViewModels;
using AutoMapper;
using DAL.Core;
using DAL.Core.Interfaces;
using DAL.Models;
using IdentityServer4;
using IdentityServer4.Configuration;
using IdentityServer4.Models;
using IdentityServer4.Services;
using IdentityServer4.Validation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Aspnetcoreapp.Controllers
{
    [Route("api/[controller]")]
    public class AccountController : ControllerBase
    {
        private readonly IAccountManager _accountManager;
        private readonly IAuthorizationService _authorizationService;
        private readonly ILogger<AccountController> _logger;
        private const string GetUserByIdActionName = "GetUserById";
        private const string GetUserIdImagesByIdActionName = "GetUserIdImagesById";

        private const string GetRoleByIdActionName = "GetRoleById";
        private readonly JwtHandler _jwtHandler;

        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly IUserClaimsPrincipalFactory<ApplicationUser> _claimsFactory;
        private readonly ITokenService _tokenService;
        private readonly IRefreshTokenService _refreshTokenService;
        private readonly IdentityServerOptions _options;
        private readonly IConfiguration _configuration;
        private readonly IMapper _mapper;

        public AccountController(IAccountManager accountManager, IAuthorizationService authorizationService,
            ILogger<AccountController> logger, UserManager<ApplicationUser> userManager,
            IUserClaimsPrincipalFactory<ApplicationUser> claimsFactory,
            JwtHandler jwtHandler, IConfiguration configuration,
            SignInManager<ApplicationUser> signInManager,
            ITokenService tokenService,
            IdentityServerOptions options,
            IRefreshTokenService refreshTokenService,
            IMapper mapper
            )
        {
            _accountManager = accountManager;
            _authorizationService = authorizationService;
            _logger = logger;
            _userManager = userManager;
            _signInManager = signInManager;
            _claimsFactory = claimsFactory;
            _configuration = configuration;
            _tokenService = tokenService;
            _options = options;
            _refreshTokenService = refreshTokenService;

            _jwtHandler = jwtHandler;
            _mapper = mapper;
        }


        [HttpPost("ExternalLogin")]
        public async Task<IActionResult> ExternalLogin([FromBody] ExternalAuthDto externalAuth)
        {
            var payload = await _jwtHandler.VerifyGoogleToken(externalAuth);
            if (payload == null)
                return BadRequest("Invalid External Authentication. Check the auth client id in appsettings.json (server) and app.module.ts (Client) both match. ");

            var info = new UserLoginInfo(externalAuth.Provider, payload.Subject, externalAuth.Provider);

            var user = await _userManager.FindByLoginAsync(info.LoginProvider, info.ProviderKey);

            if (user == null)
            {
                user = await _userManager.FindByEmailAsync(payload.Email);
                if (user == null)
                {
                    user = new ApplicationUser { Email = payload.Email, UserName = payload.Email };
                    await _userManager.CreateAsync(user);

                    //prepare and send an email for the email confirmation

                    await _userManager.AddToRoleAsync(user, "Viewer");
                    await _userManager.AddLoginAsync(user, info);
                }
                else
                {
                    await _userManager.AddLoginAsync(user, info);
                }
            }

            var tokenCreationRequest = new TokenCreationRequest();
            var identityPricipal = await _claimsFactory.CreateAsync(user);
            var identityUser = new IdentityServerUser(user.Id.ToString())
            {
                AdditionalClaims = identityPricipal.Claims.ToArray(),
                DisplayName = user.UserName,
                AuthenticationTime = DateTime.UtcNow,
                IdentityProvider = IdentityServerConstants.LocalIdentityProvider
            };

            tokenCreationRequest.Subject = identityUser.CreatePrincipal();
            tokenCreationRequest.IncludeAllIdentityClaims = true;

            tokenCreationRequest.ValidatedRequest = new ValidatedRequest
            {
                Subject = tokenCreationRequest.Subject,
                Options = _options,
                ClientClaims = identityUser.AdditionalClaims
            };

            tokenCreationRequest.ValidatedRequest.SetClient(IdentityServerConfig.GetClients().FirstOrDefault());
            tokenCreationRequest.ValidatedResources = new ResourceValidationResult(new Resources(IdentityServerConfig.GetIdentityResources(),
                IdentityServerConfig.GetApiResources(), IdentityServerConfig.GetApiScopes()));
            var accessToken = await _tokenService.CreateAccessTokenAsync(tokenCreationRequest);
            accessToken.Issuer = HttpContext.Request.Scheme + "://" + HttpContext.Request.Host.Value;
            var accessSecurityToken = await _tokenService.CreateSecurityTokenAsync(accessToken);

            var refreshToken = await _refreshTokenService.CreateRefreshTokenAsync(tokenCreationRequest.Subject,
                accessToken,
                tokenCreationRequest.ValidatedRequest.Client);

            var returndata = new
            {
                access_token = accessSecurityToken,
                expires_in = accessToken.Lifetime,
                token_type = "Bearer",
                refresh_token = refreshToken,
                scope = string.Join(" ", accessToken.Scopes)
            };

            return Ok(returndata);
        }

        [HttpGet("users/me")]
        [ProducesResponseType(200, Type = typeof(UserViewModel))]
        public async Task<IActionResult> GetCurrentUser()
        {
            return await GetUserById(Utilities.GetUserId(this.User));
        }


        [HttpGet("users/{id}", Name = GetUserByIdActionName)]
        [ProducesResponseType(200, Type = typeof(UserViewModel))]
        [ProducesResponseType(403)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> GetUserById(string id)
        {
            if (!(await _authorizationService.AuthorizeAsync(this.User, id, AccountManagementOperations.Read)).Succeeded)
                return new ChallengeResult();


            UserViewModel userVM = await GetUserViewModelHelper(id);

            if (userVM != null)
                return Ok(userVM);
            else
                return NotFound(id);
        }
        [HttpGet("users/getsecureuserbyid/{id}")]
        [ProducesResponseType(200, Type = typeof(SecureApplicationUser))]
        [ProducesResponseType(403)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> getsecureuserbyid(string id)
        {
            if (!(await _authorizationService.AuthorizeAsync(this.User, id, AccountManagementOperations.Read)).Succeeded)
                return new ChallengeResult();

            UserViewModel userVM = await GetUserViewModelHelper(id);

            if (userVM != null)
                return Ok(userVM);
            else
                return NotFound(id);
        }
       



        [HttpGet("users/username/{userName}")]
        [ApiExplorerSettings(GroupName = "Account")]
        [ProducesResponseType(200, Type = typeof(UserViewModel))]
        [ProducesResponseType(403)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> GetUserByUserName(string userName)
        {
            ApplicationUser appUser = await _accountManager.GetUserByUserNameAsync(userName);

            if (!(await _authorizationService.AuthorizeAsync(this.User, appUser?.Id ?? "", AccountManagementOperations.Read)).Succeeded)
                return new ChallengeResult();

            if (appUser == null)
                return NotFound(userName);

            return await GetUserById(appUser.Id);
        }




        [HttpGet("users")]
        [ApiExplorerSettings(GroupName = "Account")]
        [Authorize(Authorization.Policies.ViewAllUsersPolicy)]
        [ProducesResponseType(200, Type = typeof(List<UserViewModel>))]
        public async Task<IActionResult> GetUsers()
        {
            return await GetUsers(-1, -1);
        }


        [HttpGet("users/{pageNumber:int}/{pageSize:int}")]
        [Authorize(Authorization.Policies.ViewAllUsersPolicy)]
        [ProducesResponseType(200, Type = typeof(List<UserViewModel>))]
        public async Task<IActionResult> GetUsers(int pageNumber, int pageSize)
        {
            var usersAndRoles = await _accountManager.GetUsersAndRolesAsync(pageNumber, pageSize);

            List<UserViewModel> usersVM = new List<UserViewModel>();

            foreach (var item in usersAndRoles)
            {

                var userVM = _mapper.Map<UserViewModel>(item.User);
                userVM.Roles = item.Roles;

                usersVM.Add(userVM);
            }

            return Ok(usersVM);
        }


        [HttpPut("users/me")]
        [ApiExplorerSettings(GroupName = "Account")]
        [ProducesResponseType(204)]
        [ProducesResponseType(400)]
        [ProducesResponseType(403)]
        public async Task<IActionResult> UpdateCurrentUser([FromBody] UserEditViewModel user)
        {
            return await UpdateUser(Utilities.GetUserId(this.User), user);
        }


        [HttpPut("users/{id}")]
        [ApiExplorerSettings(GroupName = "Account")]
        [ProducesResponseType(204)]
        [ProducesResponseType(400)]
        [ProducesResponseType(403)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> UpdateUser(string id, [FromBody] UserEditViewModel user)
        {
            ApplicationUser appUser = await _accountManager.GetUserByIdAsync(id);
            string[] currentRoles = appUser != null ? (await _accountManager.GetUserRolesAsync(appUser)).ToArray() : null;

            var manageUsersPolicy = _authorizationService.AuthorizeAsync(this.User, id, AccountManagementOperations.Update);
            var assignRolePolicy = _authorizationService.AuthorizeAsync(this.User, (user.Roles, currentRoles), Authorization.Policies.AssignAllowedRolesPolicy);


            if ((await Task.WhenAll(manageUsersPolicy, assignRolePolicy)).Any(r => !r.Succeeded))
                return new ChallengeResult();


            if (ModelState.IsValid)
            {
                if (user == null)
                    return BadRequest($"{nameof(user)} cannot be null");

                if (!string.IsNullOrWhiteSpace(user.Id) && id != user.Id)
                    return BadRequest("Conflicting user id in parameter and model data");

                if (appUser == null)
                    return NotFound(id);

                bool isPasswordChanged = !string.IsNullOrWhiteSpace(user.NewPassword);
                bool isUserNameChanged = !appUser.UserName.Equals(user.UserName, StringComparison.OrdinalIgnoreCase);

                if (Utilities.GetUserId(this.User) == id)
                {
                    if (string.IsNullOrWhiteSpace(user.CurrentPassword))
                    {
                        if (isPasswordChanged)
                            AddError("Current password is required when changing your own password", "Password");

                        if (isUserNameChanged)
                            AddError("Current password is required when changing your own username", "Username");
                    }
                    else if (isPasswordChanged || isUserNameChanged)
                    {
                        if (!await _accountManager.CheckPasswordAsync(appUser, user.CurrentPassword))
                            AddError("The username/password couple is invalid.");
                    }
                }

                if (ModelState.IsValid)
                {
                    _mapper.Map<UserEditViewModel, ApplicationUser>(user, appUser);

                    var result = await _accountManager.UpdateUserAsync(appUser, user.Roles);
                    if (result.Succeeded)
                    {
                        if (isPasswordChanged)
                        {
                            if (!string.IsNullOrWhiteSpace(user.CurrentPassword))
                                result = await _accountManager.UpdatePasswordAsync(appUser, user.CurrentPassword, user.NewPassword);
                            else
                                result = await _accountManager.ResetPasswordAsync(appUser, user.NewPassword);
                        }

                        if (result.Succeeded)
                            return NoContent();
                    }

                    AddError(result.Errors);
                }
            }

            return BadRequest(ModelState);
        }


        [HttpPatch("users/me")]
        [ApiExplorerSettings(GroupName = "Account")]
        [ProducesResponseType(204)]
        [ProducesResponseType(400)]
        public async Task<IActionResult> UpdateCurrentUser([FromBody] JsonPatchDocument<UserPatchViewModel> patch)
        {
            return await UpdateUser(Utilities.GetUserId(this.User), patch);
        }


        [HttpPatch("users/{id}")]
        [ApiExplorerSettings(GroupName = "Account")]
        [ProducesResponseType(204)]
        [ProducesResponseType(400)]
        [ProducesResponseType(403)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> UpdateUser(string id, [FromBody] JsonPatchDocument<UserPatchViewModel> patch)
        {
            if (!(await _authorizationService.AuthorizeAsync(this.User, id, AccountManagementOperations.Update)).Succeeded)
                return new ChallengeResult();


            if (ModelState.IsValid)
            {
                if (patch == null)
                    return BadRequest($"{nameof(patch)} cannot be null");


                ApplicationUser appUser = await _accountManager.GetUserByIdAsync(id);

                if (appUser == null)
                    return NotFound(id);


                UserPatchViewModel userPVM = _mapper.Map<UserPatchViewModel>(appUser);
                patch.ApplyTo(userPVM, (e) => AddError(e.ErrorMessage));

                if (ModelState.IsValid)
                {
                    _mapper.Map<UserPatchViewModel, ApplicationUser>(userPVM, appUser);

                    var result = await _accountManager.UpdateUserAsync(appUser);
                    if (result.Succeeded)
                        return NoContent();


                    AddError(result.Errors);
                }
            }

            return BadRequest(ModelState);
        }


        [HttpPost("users")]
        [ApiExplorerSettings(GroupName = "Account")]
        [Authorize(Authorization.Policies.ManageAllUsersPolicy)]
        [ProducesResponseType(201, Type = typeof(UserViewModel))]
        [ProducesResponseType(400)]
        [ProducesResponseType(403)]
        public async Task<IActionResult> Register([FromBody] UserEditViewModel user)
        {
            if (!(await _authorizationService.AuthorizeAsync(this.User, (user.Roles, new string[] { }), Authorization.Policies.AssignAllowedRolesPolicy)).Succeeded)
                return new ChallengeResult();


            if (ModelState.IsValid)
            {
                if (user == null)
                    return BadRequest($"{nameof(user)} cannot be null");


                ApplicationUser appUser = _mapper.Map<ApplicationUser>(user);

                var result = await _accountManager.CreateUserAsync(appUser, user.Roles, user.NewPassword);
                if (result.Succeeded)
                {
                    UserViewModel userVM = await GetUserViewModelHelper(appUser.Id);
                    return CreatedAtAction(GetUserByIdActionName, new { id = userVM.Id }, userVM);
                }

                AddError(result.Errors);
            }

            return BadRequest(ModelState);
        }


        [HttpDelete("users/{id}")]
        [ApiExplorerSettings(GroupName = "Account")]
        [ProducesResponseType(200, Type = typeof(UserViewModel))]
        [ProducesResponseType(400)]
        [ProducesResponseType(403)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> DeleteUser(string id)
        {
            if (!(await _authorizationService.AuthorizeAsync(this.User, id, AccountManagementOperations.Delete)).Succeeded)
                return new ChallengeResult();


            ApplicationUser appUser = await _accountManager.GetUserByIdAsync(id);

            if (appUser == null)
                return NotFound(id);

            //if (!await _accountManager.TestCanDeleteUserAsync(id))
            //    return BadRequest("User cannot be deleted. Delete all orders associated with this user and try again");


            UserViewModel userVM = await GetUserViewModelHelper(appUser.Id);

            var result = await _accountManager.DeleteUserAsync(appUser);
            if (!result.Succeeded)
                throw new Exception("The following errors occurred whilst deleting user: " + string.Join(", ", result.Errors));


            return Ok(userVM);
        }


        [HttpPut("users/unblock/{id}")]
        [ApiExplorerSettings(GroupName = "Account")]
        [Authorize(Authorization.Policies.ManageAllUsersPolicy)]
        [ProducesResponseType(204)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> UnblockUser(string id)
        {
            ApplicationUser appUser = await _accountManager.GetUserByIdAsync(id);

            if (appUser == null)
                return NotFound(id);

            appUser.LockoutEnd = null;
            var result = await _accountManager.UpdateUserAsync(appUser);
            if (!result.Succeeded)
                throw new Exception("The following errors occurred whilst unblocking user: " + string.Join(", ", result.Errors));


            return NoContent();
        }

        [HttpGet("users/me/preferences")]
        [ApiExplorerSettings(GroupName = "Account")]
        [ProducesResponseType(200, Type = typeof(string))]
        public async Task<IActionResult> UserPreferences()
        {
            var userId = Utilities.GetUserId(this.User);
            ApplicationUser appUser = await _accountManager.GetUserByIdAsync(userId);

            return Ok(appUser.Configuration);
        }


        [HttpPut("users/me/preferences")]
        [ApiExplorerSettings(GroupName = "Account")]
        [ProducesResponseType(204)]
        public async Task<IActionResult> UserPreferences([FromBody] string data)
        {
            var userId = Utilities.GetUserId(this.User);
            ApplicationUser appUser = await _accountManager.GetUserByIdAsync(userId);

            appUser.Configuration = data;

            var result = await _accountManager.UpdateUserAsync(appUser);
            if (!result.Succeeded)
                throw new Exception("The following errors occurred whilst updating User Configurations: " + string.Join(", ", result.Errors));

            return NoContent();
        }





        [HttpGet("roles/{id}", Name = GetRoleByIdActionName)]
        [ApiExplorerSettings(GroupName = "Account")]
        [ProducesResponseType(200, Type = typeof(RoleViewModel))]
        [ProducesResponseType(403)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> GetRoleById(string id)
        {
            var appRole = await _accountManager.GetRoleByIdAsync(id);

            if (!(await _authorizationService.AuthorizeAsync(this.User, appRole?.Name ?? "", Authorization.Policies.ViewRoleByRoleNamePolicy)).Succeeded)
                return new ChallengeResult();

            if (appRole == null)
                return NotFound(id);

            return await GetRoleByName(appRole.Name);
        }


        [HttpGet("roles/name/{name}")]
        [ApiExplorerSettings(GroupName = "Account")]
        [ProducesResponseType(200, Type = typeof(RoleViewModel))]
        [ProducesResponseType(403)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> GetRoleByName(string name)
        {
            if (!(await _authorizationService.AuthorizeAsync(this.User, name, Authorization.Policies.ViewRoleByRoleNamePolicy)).Succeeded)
                return new ChallengeResult();


            RoleViewModel roleVM = await GetRoleViewModelHelper(name);

            if (roleVM == null)
                return NotFound(name);

            return Ok(roleVM);
        }


        [HttpGet("roles")]
        [ApiExplorerSettings(GroupName = "Account")]
        [Authorize(Authorization.Policies.ViewAllRolesPolicy)]
        [ProducesResponseType(200, Type = typeof(List<RoleViewModel>))]
        public async Task<IActionResult> GetRoles()
        {
            return await GetRoles(-1, -1);
        }


        [HttpGet("roles/{pageNumber:int}/{pageSize:int}")]
        [ApiExplorerSettings(GroupName = "Account")]
        [Authorize(Authorization.Policies.ViewAllRolesPolicy)]
        [ProducesResponseType(200, Type = typeof(List<RoleViewModel>))]
        public async Task<IActionResult> GetRoles(int pageNumber, int pageSize)
        {
            var roles = await _accountManager.GetRolesLoadRelatedAsync(pageNumber, pageSize);
            return Ok(_mapper.Map<List<RoleViewModel>>(roles));
        }


        [HttpPut("roles/{id}")]
        [ApiExplorerSettings(GroupName = "Account")]
        [Authorize(Authorization.Policies.ManageAllRolesPolicy)]
        [ProducesResponseType(204)]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> UpdateRole(string id, [FromBody] RoleViewModel role)
        {
            if (ModelState.IsValid)
            {
                if (role == null)
                    return BadRequest($"{nameof(role)} cannot be null");

                if (!string.IsNullOrWhiteSpace(role.Id) && id != role.Id)
                    return BadRequest("Conflicting role id in parameter and model data");



                ApplicationRole appRole = await _accountManager.GetRoleByIdAsync(id);

                if (appRole == null)
                    return NotFound(id);


                _mapper.Map<RoleViewModel, ApplicationRole>(role, appRole);

                var result = await _accountManager.UpdateRoleAsync(appRole, role.Permissions?.Select(p => p.Value).ToArray());
                if (result.Succeeded)
                    return NoContent();

                AddError(result.Errors);

            }

            return BadRequest(ModelState);
        }


        [HttpPost("roles")]
        [ApiExplorerSettings(GroupName = "Account")]
        [Authorize(Authorization.Policies.ManageAllRolesPolicy)]
        [ProducesResponseType(201, Type = typeof(RoleViewModel))]
        [ProducesResponseType(400)]
        public async Task<IActionResult> CreateRole([FromBody] RoleViewModel role)
        {
            if (ModelState.IsValid)
            {
                if (role == null)
                    return BadRequest($"{nameof(role)} cannot be null");


                ApplicationRole appRole = _mapper.Map<ApplicationRole>(role);

                var result = await _accountManager.CreateRoleAsync(appRole, role.Permissions?.Select(p => p.Value).ToArray());
                if (result.Succeeded)
                {
                    RoleViewModel roleVM = await GetRoleViewModelHelper(appRole.Name);
                    return CreatedAtAction(GetRoleByIdActionName, new { id = roleVM.Id }, roleVM);
                }

                AddError(result.Errors);
            }

            return BadRequest(ModelState);
        }


        [HttpDelete("roles/{id}")]
        [ApiExplorerSettings(GroupName = "Account")]
        [Authorize(Authorization.Policies.ManageAllRolesPolicy)]
        [ProducesResponseType(200, Type = typeof(RoleViewModel))]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> DeleteRole(string id)
        {
            ApplicationRole appRole = await _accountManager.GetRoleByIdAsync(id);

            if (appRole == null)
                return NotFound(id);

            if (!await _accountManager.TestCanDeleteRoleAsync(id))
                return BadRequest("Role cannot be deleted. Remove all users from this role and try again");


            RoleViewModel roleVM = await GetRoleViewModelHelper(appRole.Name);

            var result = await _accountManager.DeleteRoleAsync(appRole);
            if (!result.Succeeded)
                throw new Exception("The following errors occurred whilst deleting role: " + string.Join(", ", result.Errors));


            return Ok(roleVM);
        }


        [HttpGet("permissions")]
        [ApiExplorerSettings(GroupName = "Account")]
        [Authorize(Authorization.Policies.ViewAllRolesPolicy)]
        [ProducesResponseType(200, Type = typeof(List<PermissionViewModel>))]
        public IActionResult GetAllPermissions()
        {
            return Ok(_mapper.Map<List<PermissionViewModel>>(ApplicationPermissions.AllPermissions));
        }



        private async Task<UserViewModel> GetUserViewModelHelper(string userId)
        {
            var userAndRoles = await _accountManager.GetUserAndRolesAsync(userId);
            if (userAndRoles == null)
                return null;

            var userVM = _mapper.Map<UserViewModel>(userAndRoles.Value.User);
            userVM.Roles = userAndRoles.Value.Roles;

            return userVM;
        }


        private async Task<RoleViewModel> GetRoleViewModelHelper(string roleName)
        {
            var role = await _accountManager.GetRoleLoadRelatedAsync(roleName);
            if (role != null)
                return _mapper.Map<RoleViewModel>(role);


            return null;
        }


        private void AddError(IEnumerable<string> errors, string key = "")
        {
            foreach (var error in errors)
            {
                AddError(error, key);
            }
        }

        private void AddError(string error, string key = "")
        {
            ModelState.AddModelError(key, error);
        }
        public class AccountOptions
        {
            public static bool AllowLocalLogin = true;
            public static bool AllowRememberLogin = true;
            public static TimeSpan RememberMeLoginDuration = TimeSpan.FromDays(30);

            public static bool ShowLogoutPrompt = true;
            public static bool AutomaticRedirectAfterSignOut = false;

            public static string InvalidCredentialsErrorMessage = "Invalid username or password";
        }

    }
}

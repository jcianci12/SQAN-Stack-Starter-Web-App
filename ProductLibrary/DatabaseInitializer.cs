﻿

using DAL.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DAL.Core;
using DAL.Core.Interfaces;

namespace DAL
{
    public interface IDatabaseInitializer
    {
        Task SeedAsync();
    }

    public class DatabaseInitializer : IDatabaseInitializer
    {
        private readonly databaseContext _context;
        private readonly IAccountManager _accountManager;
        private readonly ILogger _logger;

        public DatabaseInitializer(databaseContext context, IAccountManager accountManager, ILogger<DatabaseInitializer> logger)
        {
            _accountManager = accountManager;
            _context = context;
            _logger = logger;
        }

        public async Task SeedAsync()
        {
             _context.Database.Migrate();
            //await _context.Database.MigrateAsync().ConfigureAwait(false);

            if (!await _context.Users.AnyAsync())
            {
               _logger.LogInformation("Generating inbuilt accounts");

            const string adminRoleName = "administrator";
                const string userRoleName = "VIEWER";


                await EnsureRoleAsync(adminRoleName, "Default administrator", ApplicationPermissions.GetAllPermissionValues());
            await EnsureRoleAsync(userRoleName, "Default user", new string[] { });

            await CreateUserAsync("admin12", "Admin12$", "Inbuilt Administrator", "admin@gmail.com", "1234", new string[] { adminRoleName });
            //await CreateUserAsync("user", "tempP@ss123", "Inbuilt Standard User", "user@ebenmonney.com", "+1 (123) 000-0001", new string[] { userRoleName });

            _logger.LogInformation("Inbuilt account generation completed");
            }



            await _context.SaveChangesAsync();

            _logger.LogInformation("Seeding initial data completed");
        }




        private async Task EnsureRoleAsync(string roleName, string description, string[] claims)
        {
            if ((await _accountManager.GetRoleByNameAsync(roleName)) == null)
            {
                ApplicationRole applicationRole = new ApplicationRole(roleName, description);

                var result = await this._accountManager.CreateRoleAsync(applicationRole, claims);

                if (!result.Succeeded)
                    throw new Exception($"Seeding \"{description}\" role failed. Errors: {string.Join(Environment.NewLine, result.Errors)}");
            }
        }

        private async Task<ApplicationUser> CreateUserAsync(string userName, string password, string fullName, string email, string phoneNumber, string[] roles)
        {

            ApplicationUser applicationUser = _accountManager.GetUserByEmailAsync(email).Result;
            if (applicationUser == null)
            {
                applicationUser = new ApplicationUser
                {
                    UserName = userName,
                    FullName = fullName,
                    Email = email,
                    PhoneNumber = phoneNumber,
                    EmailConfirmed = true,
                    IsEnabled = true,
                    CreatedDate = DateTime.Now,
                    UpdatedDate = DateTime.Now
                };
                var result = await _accountManager.CreateUserAsync(applicationUser, roles, password);

                if (!result.Succeeded)
                    throw new Exception($"Seeding \"{userName}\" user failed. Errors: {string.Join(Environment.NewLine, result.Errors)}");

            }



            return applicationUser;
        }
    }
}


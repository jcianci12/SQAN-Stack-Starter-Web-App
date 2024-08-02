using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Net.NetworkInformation;
using System.Text;
using System.Threading;
using Aspnetcoreapp.Authorization;
using Aspnetcoreapp.Controllers;
using Aspnetcoreapp.Helpers;
using Aspnetcoreapp.SignalR;
using DAL;
using DAL.Core;
using DAL.Core.Interfaces;
using DAL.Models;
using IdentityServer4.Extensions;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.Controllers;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Logging;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;

using AppPermissions = DAL.Core.ApplicationPermissions;
using System.Threading.Tasks;
using System.Net.Http;
using Aspnetcoreapp.ViewModels;
using AutoMapper;

namespace Aspnetcoreapp
{
    public class Startup
    {
        private IWebHostEnvironment currentEnvironment { get; set; }

        public IConfiguration Configuration { get; }

        public Startup(IConfiguration configuration, IWebHostEnvironment env)
        {
            this.currentEnvironment = env;
            this.Configuration = configuration;

            // var builder = new ConfigurationBuilder().SetBasePath(currentEnvironment.ContentRootPath)
            //             .AddJsonFile("appsettings.Development.json", optional: true, reloadOnChange: true);
            // Configuration = builder.Build();
            Debug.WriteLine("------------------------------");
            Debug.WriteLine("--------" + env.EnvironmentName + " MODE------");
            Debug.WriteLine("------------------------------");
        }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {

            // Add cors
            services.AddCors(options =>
            {
                options.AddPolicy("AllowAll",
                    builder =>
                    {
                        builder.WithOrigins("http://localhost:4200", "http://localhost:5000",  "https://demosqanapp.tekonline.com.au")
                            .AllowAnyHeader()
                            .AllowCredentials()
                            .AllowAnyMethod();
                    });
            });


            services
               .AddDbContext<databaseContext>(options =>
                   options
                       .UseSqlServer(Configuration["ConnectionStrings:DefaultConnection"],
                       b =>
                       {
                           b.MigrationsAssembly("Aspnetcoreapp");
                           b.UseNetTopologySuite();
                       }));
            services
                .AddMvc()
                .AddNewtonsoftJson(o =>
                    o.SerializerSettings.ReferenceLoopHandling =
                        Newtonsoft.Json.ReferenceLoopHandling.Ignore);

            // this will make the wehireitContext available to any other object that needs it injected
            //services.AddDbContext<wehireitContext>(options =>
            //   options.UseSqlServer(Configuration["ConnectionStrings:DefaultConnection"]));
            services.AddScoped<IDatabaseInitializer, DatabaseInitializer>();
            services.AddScoped<JwtHandler>();


            //add identity
            services
                .AddIdentity<ApplicationUser, ApplicationRole>()
                .AddEntityFrameworkStores<databaseContext>()
                .AddDefaultTokenProviders();

            // Configure Identity options and password complexity here
            services
                .Configure<IdentityOptions>(options =>
                {
                    // User settings
                    options.User.RequireUniqueEmail = true;

                    //    //// Password settings
                    //    //options.Password.RequireDigit = true;
                    //    //options.Password.RequiredLength = 8;
                    //    //options.Password.RequireNonAlphanumeric = false;
                    //    //options.Password.RequireUppercase = true;
                    //    //options.Password.RequireLowercase = false;

                    //    //// Lockout settings
                    //    //options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(30);
                    //    //options.Lockout.MaxFailedAccessAttempts = 10;
                });
            services
                .Configure<IISServerOptions>(options =>
                {
                    options.MaxRequestBodySize = int.MaxValue;
                });

            // Configurations
            services.Configure<AppSettings>(Configuration);

            // Adds IdentityServer.
            services
                .AddIdentityServer()
                .// The AddDeveloperSigningCredential extension creates temporary key material for signing tokens.
                 // This might be useful to get started, but needs to be replaced by some persistent key material for production scenarios.
                 // See http://docs.identityserver.io/en/release/topics/crypto.html#refcrypto for more information.
                AddDeveloperSigningCredential()
                .AddInMemoryPersistedGrants()
                .// To configure IdentityServer to use EntityFramework (EF) as the storage mechanism for configuration data (rather than using the in-memory implementations),
                 // see https://identityserver4.readthedocs.io/en/release/quickstarts/8_entity_framework.html
                AddInMemoryIdentityResources(IdentityServerConfig
                    .GetIdentityResources())
                .AddInMemoryApiScopes(IdentityServerConfig.GetApiScopes())
                .AddInMemoryClients(IdentityServerConfig.GetClients())
                .AddAspNetIdentity<ApplicationUser>()
                .AddProfileService<ProfileService>();

            // var applicationUrl = Configuration["ApplicationUrl"].TrimEnd('/');
            var applicationUrl = Configuration["Application_URL"].TrimEnd('/');

            var ServeMethod = Configuration["ServeMethod"];

            JwtSecurityTokenHandler.DefaultInboundClaimTypeMap.Clear();

            //     services.AddAuthentication(IdentityServerAuthenticationDefaults.AuthenticationScheme)
            //   .AddIdentityServerAuthentication(auth =>
            //   {
            //       auth.Authority = applicationUrl;
            //       auth.SupportedTokens = SupportedTokens.Jwt;
            //       auth.RequireHttpsMetadata = false; // Note: Set to true in production
            //       auth.ApiName = IdentityServerConfig.ApiName;
            //       //auth.LegacyAudienceValidation = true;
            //       //auth.LegacyAudienceValidation =true;
            //   });
            services
                .AddAuthentication(auth =>
                {
                    auth.DefaultAuthenticateScheme =
                        JwtBearerDefaults.AuthenticationScheme;
                    auth.DefaultChallengeScheme =
                        JwtBearerDefaults.AuthenticationScheme;
                })
                .AddJwtBearer(options =>
                {
                    options.Authority = applicationUrl;

                    options.RequireHttpsMetadata = false;

                    if (currentEnvironment.EnvironmentName.Contains("Development"))
                    {
#pragma warning disable S4830
                        HttpClientHandler handler = new()
                        {

                            ServerCertificateCustomValidationCallback = HttpClientHandler.DangerousAcceptAnyServerCertificateValidator
                        };
#pragma warning restore S4830
                        options.BackchannelHttpHandler = handler;
                    }

                    options.TokenValidationParameters =
                        new Microsoft.IdentityModel.Tokens.TokenValidationParameters
                        {
                            ValidateIssuer = false,
                            ValidateAudience = false,
                            ValidIssuer = applicationUrl,
                            RequireExpirationTime = true,
                            IssuerSigningKey =
                                new SymmetricSecurityKey(Encoding
                                        .UTF8
                                        .GetBytes("wehireit is a convenient service!")),
                            ValidateIssuerSigningKey = true,
                            RoleClaimType = "roles",
                            NameClaimType = "name"
                        };
                    options.Events =
                        new JwtBearerEvents
                        {
                            OnMessageReceived =
                                context =>
                                {
                                    var accessToken =
                                        context.Request.Query["access_token"];

                                    // If the request is for our hub...
                                    var path = context.HttpContext.Request.Path;
                                    if (
                                        !string.IsNullOrEmpty(accessToken) &&
                                        (path.StartsWithSegments("/ChatHub"))
                                    )
                                    {
                                        // Read the token out of the query string
                                        context.Token = accessToken;
                                    }
                                    return Task.CompletedTask;
                                }
                        };
                })
                   .AddGoogle(options =>
   {
       IConfigurationSection googleAuthNSection = Configuration.GetSection("Authentication:Google");
       options.ClientId = googleAuthNSection["ClientId"];
       options.ClientSecret = googleAuthNSection["ClientSecret"];

   });

            services
                .AddAuthorization(options =>
                {
                    options
                        .AddPolicy(Authorization.Policies.ViewAllUsersPolicy,
                        policy =>
                            policy
                                .RequireClaim(ClaimConstants.Permission,
                                AppPermissions.ViewUsers));
                    options
                        .AddPolicy(Authorization.Policies.ManageAllUsersPolicy,
                        policy =>
                            policy
                                .RequireClaim(ClaimConstants.Permission,
                                AppPermissions.ManageUsers));

                    options
                        .AddPolicy(Authorization.Policies.ViewAllRolesPolicy,
                        policy =>
                            policy
                                .RequireClaim(ClaimConstants.Permission,
                                AppPermissions.ViewRoles));
                    options
                        .AddPolicy(Authorization
                            .Policies
                            .ViewRoleByRoleNamePolicy,
                        policy =>
                            policy
                                .Requirements
                                .Add(new ViewRoleAuthorizationRequirement()));
                    options
                        .AddPolicy(Authorization.Policies.ManageAllRolesPolicy,
                        policy =>
                            policy
                                .RequireClaim(ClaimConstants.Permission,
                                AppPermissions.ManageRoles));

                    options
                        .AddPolicy(Authorization
                            .Policies
                            .AssignAllowedRolesPolicy,
                        policy =>
                            policy
                                .Requirements
                                .Add(new AssignRolesAuthorizationRequirement()));
                });

            IdentityModelEventSource.ShowPII = true;



            services.AddControllersWithViews();
            services.AddSignalR();
            services.AddSingleton<ChatHub>();

            // In production, the Angular files will be served from this directory\
            if (ServeMethod == "staticfiles")
                services
                    .AddSpaStaticFiles(configuration =>
                    {
                        configuration.RootPath = "ClientApp/dist";
                    });

            services
                .AddSwaggerGen(c =>
                {
                    //c.OperationFilter<FileResultContentTypeOperationFilter>();
                    //c.SwaggerDoc("Scrape", new OpenApiInfo { Title = IdentityServerConfig.ApiFriendlyName, Version = "Scrape" });
                    //c.SwaggerDoc("Selenium", new OpenApiInfo { Title = IdentityServerConfig.ApiFriendlyName, Version = "Selenium" });
                    ////c.SwaggerDoc("Cases", new OpenApiInfo { Title = IdentityServerConfig.ApiFriendlyName, Version = "v1" });
                    ////c.SwaggerDoc("Contacts", new OpenApiInfo { Title = IdentityServerConfig.ApiFriendlyName, Version = "v1" });
                    c
                        .SwaggerDoc("v1",
                        new OpenApiInfo
                        {
                            Title = IdentityServerConfig.ApiFriendlyName,
                            Version = "v1"
                        });

                    c
                        .TagActionsBy(api =>
                        {
                            if (api.GroupName != null)
                            {
                                return new[] { api.GroupName };
                            }

                            var controllerActionDescriptor =
                                api.ActionDescriptor as
                                ControllerActionDescriptor;
                            if (controllerActionDescriptor != null)
                            {
                                return new[]
                                { controllerActionDescriptor.ControllerName };
                            }
                            throw new InvalidOperationException("unable to determine tag for endpoint!");
                        });
                    c.DocInclusionPredicate((name, api) => true);

                    c.OperationFilter<AuthorizeCheckOperationFilter>();
                    c
                        .AddSecurityDefinition("oauth2",
                        new OpenApiSecurityScheme
                        {
                            Type = SecuritySchemeType.OAuth2,
                            Flows =
                                new OpenApiOAuthFlows
                                {
                                    Password =
                                        new OpenApiOAuthFlow
                                        {
                                            TokenUrl =
                                                new Uri("/connect/token",
                                                    UriKind.Relative),
                                            Scopes =
                                                new Dictionary<string, string>()
                                                {
                                                    {
                                                        IdentityServerConfig
                                                            .ApiName,
                                                        IdentityServerConfig
                                                            .ApiFriendlyName
                                                    }
                                                }
                                        }
                                }
                        });

                    c
                        .ResolveConflictingActions(apiDescriptions =>
                            apiDescriptions.First());
                });

            // Auto Mapper Configurations
            var mapperConfig = new MapperConfiguration(mc =>
            {
                mc.AddProfile(new AutoMapperProfile());
            });

            IMapper mapper = mapperConfig.CreateMapper();
            services.AddSingleton(mapper);

            // Configurations
            services.Configure<AppSettings>(Configuration);

            // Business Services
            services.AddScoped<IEmailSender, EmailSender>();

            // Repositories
            services.AddScoped<IUnitOfWork, HttpUnitOfWork>();
            services.AddScoped<IAccountManager, AccountManager>();

            // Auth Handlers
            services
                .AddSingleton
                <IAuthorizationHandler, ViewUserAuthorizationHandler>();
            services
                .AddSingleton
                <IAuthorizationHandler, ManageUserAuthorizationHandler>();
            services
                .AddSingleton
                <IAuthorizationHandler, ViewRoleAuthorizationHandler>();
            services
                .AddSingleton
                <IAuthorizationHandler, AssignRolesAuthorizationHandler>();

            // DB Creation and Seeding
            while (!PingHost("localhost"))
            {
                Debug.WriteLine("PIng failed. Waiting a second");
                Thread.Sleep(1000);
            }
            services.AddTransient<IDatabaseInitializer, DatabaseInitializer>();
        }

        public static bool PingHost(string nameOrAddress)
        {
            bool pingable = false;
            Ping pinger = null;

            try
            {
                pinger = new Ping();
                PingReply reply = pinger.Send(nameOrAddress);
                pingable = reply.Status == IPStatus.Success;
            }
            catch (PingException)
            {
                // Discard PingExceptions and return false;
            }
            finally
            {
                if (pinger != null)
                {
                    pinger.Dispose();
                }
            }

            return pingable;
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(
            IApplicationBuilder app,
            IWebHostEnvironment env,
            ILoggerFactory loggerFactory,
            Microsoft.Extensions.Hosting.IHostApplicationLifetime
            applicationLifetime
        )
        {
            app.UseRouting();

            app.UseCors(builder => builder
            .WithOrigins(["http://localhost:4200", "http://localhost:5000", "http://instance-20240412-1710:8090/", "https://wehireit.com.au", "https://www.wehireit.com.au"])
                           .AllowAnyHeader()
                           .AllowCredentials()
                                                           .AllowAnyMethod()
)
                           ;

            Utilities.ConfigureLogger(loggerFactory);
            EmailTemplates.Initialize(env);
            app
                .Use(async (ctx, next) =>
                {
                    //THis is what makes NGINX ssl offloading work!!!!!
                    //This tells Identity that where the endpoint origin/base path is.
                    ctx
                        .SetIdentityServerOrigin(Configuration["Application_URL"]
                            .TrimEnd('/'));
                    await next();
                });
            app.UseForwardedHeaders();

            if (env.EnvironmentName.Contains("Development"))
            {
                app.UseDeveloperExceptionPage();
                app.UseBrowserLink();

            }
            else
            {
                app.UseExceptionHandler("/Error");

                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                // app.UseHsts();
            }

            // app.UseHttpsRedirection();

            //app.UseStaticFiles();
            // {
            //     FileProvider = new PhysicalFileProvider(Path.Combine(Directory.GetCurrentDirectory(), @"Resources")),
            //     RequestPath = new PathString("/Resources")
            // });
            // if (env.IsProduction())
            // {
            //     app.UseSpaStaticFiles();
            // }



            app.UseIdentityServer(); //required to enable the well known endpoint
            app.UseAuthentication();
            app.UseAuthorization();
            if (env.EnvironmentName.Contains("Development"))
            {
                app.UseSwagger();
                app
                    .UseSwaggerUI(c =>
                    {
                        c.DocumentTitle = "Swagger UI - CDIS3";

                        //root endpoint
                        c
                            .SwaggerEndpoint("/swagger/v1/swagger.json",
                            $"{IdentityServerConfig.ApiFriendlyName} V1");

                        //account endpoint
                        c
                            .SwaggerEndpoint("/swagger/account/swagger.json",
                            $"{IdentityServerConfig.ApiFriendlyName} Account");

                        c.OAuthClientId(IdentityServerConfig.SwaggerClientID);

                        c.OAuthClientSecret("no_password"); //Leaving it blank doesn't work
                    });
            }

            app
                .UseEndpoints(endpoints =>
                {
                    endpoints
                        .MapControllerRoute(name: "default",
                        pattern: "{controller}/{action=Index}/{id?}");
                    endpoints.MapHub<ChatHub>("/ChatHub");
                });

            // app
            //     .UseSpa(spa =>
            //     {
            //         // To learn more about options for serving an Angular SPA from ASP.NET Core,
            //         // see https://go.microsoft.com/fwlink/?linkid=864501
            //         spa.Options.SourcePath = "ClientApp";
            //         if (env.EnvironmentName.Contains("Development"))
            //         {
            //             //spa.UseAngularCliServer(npmScript: "start");
            //             //spa.Options.StartupTimeout = TimeSpan.FromSeconds(120); // Increase the timeout if angular app is taking longer to startup
            //             spa
            //                 .UseProxyToSpaDevelopmentServer("http://localhost:4200"); // Use this instead to use the angular cli server
            //         }
            //     });
            applicationLifetime.ApplicationStopping.Register(OnShutdown);
        }

        private void OnShutdown()
        {
            //this code is called when the application stops
            foreach (var process in Process.GetProcessesByName("chrome"))
            {
                process.Kill();
            }
            foreach (var process in Process.GetProcessesByName("chromedriver"))
            {
                process.Kill();
            }

        }
    }
}

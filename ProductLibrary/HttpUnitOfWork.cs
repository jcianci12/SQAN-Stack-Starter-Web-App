﻿

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DAL.Core;
using Microsoft.AspNetCore.Http;

namespace DAL
{
    public class HttpUnitOfWork : UnitOfWork
    {
        public HttpUnitOfWork(databaseContext context, IHttpContextAccessor httpAccessor) : base(context)
        {
            context.CurrentUserId = httpAccessor.HttpContext?.User.FindFirst(ClaimConstants.Subject)?.Value?.Trim();
        }
    }
}

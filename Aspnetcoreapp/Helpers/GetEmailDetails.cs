

using System;
using Microsoft.Extensions.FileProviders;
using Microsoft.AspNetCore.Hosting;
using System.IO;
using System.Reflection;
using DAL.Models;
using DAL;
using Microsoft.AspNetCore.Mvc;
using System.Linq;


namespace Aspnetcoreapp.Helpers
{
    public class GetEmailDetails : ControllerBase
    {



        public GetEmailDetails()
        {
        }


       

       
        public string? vendorname { get; set; }
        public string? vendoremail { get; set; }
        public string? Message { get; set; }

        public string? clientname { get; set; }
        public string? clientemail { get; set; }
        public string? clientphone { get; set; }
        public string? item { get; set; }
        public string? startdate { get; set; }
        public string? enddate { get; set; }
        public string? hours { get; set; }
        public string? price { get; set; }
        public string? total { get; set; }

        public string? Sender { get; set; }
        public string? Recepient { get; set; }
    }
}

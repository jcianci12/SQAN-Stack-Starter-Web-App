﻿// <auto-generated> This file has been auto generated by EF Core Power Tools. </auto-generated>
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DAL.Models
{
    public partial class Profiles
    {
        public Guid UserId { get; set; }
        [Required]
        public string PropertyNames { get; set; }
        [Required]
        public string PropertyValueStrings { get; set; }
        [Required]
        public byte[] PropertyValueBinary { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime LastUpdatedDate { get; set; }
    }
}
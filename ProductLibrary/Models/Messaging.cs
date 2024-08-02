

using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using NetTopologySuite.Geometries;

namespace DAL.Models
{
    [Table("Message")]
    public class Message : AuditableEntity
    {
        public int Id { get; set; }
        public string MessageText { get; set; }

        public string MessageSenderId { get; set; }
        public ApplicationUser MessageSender { get; set; }

         public string MessageRecepientId { get; set; }
        public ApplicationUser MessageRecepient { get; set; }

    }

}

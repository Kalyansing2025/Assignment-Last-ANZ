using Abp.Domain.Entities.Auditing;
using MyTraining1101Demo.Authorization.Users;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MyTraining1101Demo.Customers
{
    [Table("PbCustomerUsers")]
    public class CustomerUser : CreationAuditedEntity<long>
    {
        [ForeignKey(nameof(User))]
        public virtual long UserId { get; set; }
        public virtual User User { get; set; }

        [ForeignKey(nameof(Customer))]
        public virtual int CustomerId { get; set; }
        public virtual Customer Customer { get; set; }

        public virtual decimal TotalBillingAmount { get; set; }

        // Optional - only if needed separately from FK
        // public long CustomerRefId { get; set; }
        // public long UserRefId { get; set; }
    }
}

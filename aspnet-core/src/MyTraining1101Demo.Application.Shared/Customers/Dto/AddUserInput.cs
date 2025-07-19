using System;
using System.Collections.Generic;
using System.Text;

namespace MyTraining1101Demo.Customers.Dto
{
    public class AddUserInput
    {
        public int CustomerRefId { get; set; }
        public long UserRefId { get; set; }
        public decimal TotalBillingAmount { get; set; }
    }
}

using System;
using System.Collections.Generic;
using System.Text;

namespace MyTraining1101Demo.Customers.Dto
{
    public class EditCustomerInput
    {
        public int Id { get; set; }
        public string CustomerName { get; set; }
        public string EmailAddress { get; set; }
        public DateTime RegistrationDate { get; set; }
        public string Address { get; set; }

    }
}

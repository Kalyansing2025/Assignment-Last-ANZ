using Abp.Application.Services;
using Abp.Application.Services.Dto;
using MyTraining1101Demo.Customers.Dto;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace MyTraining1101Demo.Customers
{
    public interface ICustomerAppService : IApplicationService
    {
        ListResultDto<CustomerListDto> GetCustomer(GetCustomerInput input);
        Task CreateCustomer(CreateCustomerInput input);
        Task DeleteCustomer(EntityDto input);
        Task DeleteUser(EntityDto<long> input);
        Task<UserInCustomerListDto> AddUser(AddUserInput input);
        Task<GetCustomerForEditOutput> GetCustomerForEdit(GetCustomerForEditInput input);
        Task EditCustomer(EditCustomerInput input);
        List<UserViewDto> GetUserViewAsync(GetUserCustomerIdDto input);
        Task DeleteMultipleCustomer(List<int> id);
    }
}

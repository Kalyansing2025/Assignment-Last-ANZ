using Abp.Application.Services.Dto;
using Abp.Collections.Extensions;
using MyTraining1101Demo.Customers;
using Abp.Domain.Repositories;
using Abp.Extensions;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using MyTraining1101Demo.Authorization.Users;
using MyTraining1101Demo.Customers.Dto;
using Stripe;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MyTraining1101Demo.Customers
{
    public class CustomerAppService : MyTraining1101DemoAppServiceBase , ICustomerAppService
    {

        private readonly IRepository<Customer> _customerRepository;
        private readonly IRepository<CustomerUser, long> _customerUserRepository;
        private readonly IRepository<User, long> _userRepository;

        public CustomerAppService
            (
             IRepository<Customer> customerRepository,
            IRepository<CustomerUser, long> customerUserRepository,
            IRepository<User, long> userRepository
            )
        {

            _customerRepository = customerRepository;
            _customerUserRepository = customerUserRepository;
            _userRepository = userRepository;
        }

        public ListResultDto<CustomerListDto> GetCustomer(GetCustomerInput input)
        {
            var customer = _customerRepository
                .GetAll()
                .Include(p => p.CustomerUsers)
                .WhereIf(
                    !input.Filter.IsNullOrEmpty(),
                    p => p.CustomerName.Contains(input.Filter) ||
                        p.EmailAddress.Contains(input.Filter) ||
                        p.Address.Contains(input.Filter)
                )
                .OrderBy(p => p.CustomerName)

                .ToList();

            return new ListResultDto<CustomerListDto>(ObjectMapper.Map<List<CustomerListDto>>(customer));
        }

        public async Task CreateCustomer(CreateCustomerInput input)
        {
            var customer = ObjectMapper.Map<Customer>(input);

            await _customerRepository.InsertAndGetIdAsync(customer);
            //await _customerRepository.GetAll().ToListAsync();
            var allCustomer = await _customerRepository.GetAll().ToListAsync();
            var lastCust = allCustomer.Last();
            var u = lastCust.Id;
            var customerId = u;
            var c = input.UserRefId;
            var userId = c;
            foreach (var user in userId)
            {
                var custmerUsers = new CustomerUser
                {
                    CustomerId = customerId,
                    UserId = user,
                    TotalBillingAmount = 654.87m
                };
                await _customerUserRepository.InsertAsync(custmerUsers);

                if (user != null)
                {
                    var userValue = await _userRepository.FirstOrDefaultAsync(u => u.Id == user);
                    userValue.IsUser = true;
                    await _userRepository.UpdateAsync(userValue);
                }
            }

        }

        public async Task DeleteCustomer(EntityDto input)
        {
            await _customerRepository.DeleteAsync(input.Id);
        }

        public async Task<GetCustomerForEditOutput> GetCustomerForEdit(GetCustomerForEditInput input)
        {
            var customer = await _customerRepository.GetAsync(input.Id);
            return ObjectMapper.Map<GetCustomerForEditOutput>(customer);
        }


        public async Task EditCustomer(EditCustomerInput input)
        {
            var customer = await _customerRepository.GetAsync(input.Id);
            customer.CustomerName = input.CustomerName;
            customer.EmailAddress = input.EmailAddress;
            customer.RegistrationDate = input.RegistrationDate;
            customer.Address = input.Address;

            await _customerRepository.UpdateAsync(customer);
        }

        public async Task DeleteUser(EntityDto<long> input)
        {
            await _customerUserRepository.DeleteAsync(input.Id);
        }

        public async Task<UserInCustomerListDto> AddUser(AddUserInput input)
        {

            try
            {
                var customer = _customerRepository.Get(input.CustomerRefId);
                await _customerRepository.EnsureCollectionLoadedAsync(customer, p => p.CustomerUsers);


                var user = ObjectMapper.Map<CustomerUser>(input);
                customer.CustomerUsers.Add(user);

                await CurrentUnitOfWork.SaveChangesAsync();

                return ObjectMapper.Map<UserInCustomerListDto>(user);
            }
            catch
            {
                return null;
            }
        }

        public ListResultDto<User> GetUsersAsync(GetUserInput input)
        {

            var users = _userRepository.GetAll().Where(u => u.IsUser == false).
                WhereIf(!input.Filter.IsNullOrEmpty(),
                c => c.Name.Contains(input.Filter) ||
                c.EmailAddress.Contains(input.Filter)
                ).OrderBy(c => c.Id).ToList();

            return new ListResultDto<User>(ObjectMapper.Map<List<User>>(users));
        }

        public List<UserViewDto> GetUserViewAsync(GetUserCustomerIdDto input)
        {
            var customer = _customerUserRepository
                           .GetAll()
                           .Include(u => u.User)
                           .Where(p => p.CustomerId == input.Id) // Fixed line
                           .Select(l => l.User)
                           .ToList();

            return new List<UserViewDto>(ObjectMapper.Map<List<UserViewDto>>(customer));
        }


        public async Task DeleteMultipleCustomer(List<int> id)
        {
            foreach (var item in id)
            {
                await _customerRepository.DeleteAsync(item);
            }
        }

    }
}

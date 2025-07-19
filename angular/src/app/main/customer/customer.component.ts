import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { UserListDto, UserServiceProxy, PagedResultDtoOfUserListDto, GetUsersInput } from '@shared/service-proxies/service-proxies';
import { CreateEditCustomerModalComponent, CustomerDto } from './create-edit-customer/create-edit-customer-modal.component';
import { ViewUsersModalComponent } from './view-users/view-users-modal.component';
import { finalize } from 'rxjs/operators';


@Component({
  templateUrl: './customer.component.html',
  animations: [appModuleAnimation()],
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent extends AppComponentBase implements OnInit {

  @ViewChild('createEditCustomerModal', { static: true }) createEditCustomerModal: CreateEditCustomerModalComponent;
  @ViewChild('viewUsersModal', { static: true }) viewUsersModal: ViewUsersModalComponent;

  customers: CustomerDto[] = [];
  keyword = '';
  totalItems = 0;
  pageSize = 10;
  pageNumber = 1;
  isLoading = false;

  constructor(
    injector: Injector,
    private _userService: UserServiceProxy
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.getCustomers();
  }

  getCustomers(): void {
    this.isLoading = true;
    const skipCount = (this.pageNumber - 1) * this.pageSize;

    // For now, simulate customer loading using user service
    // This will be replaced with actual customer service
    const input = new GetUsersInput();
    input.filter = this.keyword;
    input.skipCount = skipCount;
    input.maxResultCount = this.pageSize;

    this._userService
      .getUsers(input)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe((result: PagedResultDtoOfUserListDto) => {
        // Map users to customers for demo purposes
        this.customers = result.items.map(user => {
          const customer = new CustomerDto();
          customer.id = user.id;
          customer.customerName = `${user.name} ${user.surname}`;
          customer.emailId = user.emailAddress;
          customer.phoneNumber = user.phoneNumber || 'N/A';
          customer.address = 'Sample Address';
          customer.registrationDate = user.creationTime ? user.creationTime.toJSDate() : new Date();
          return customer;
        });
        this.totalItems = result.totalCount;
      });
  }

  delete(customer: CustomerDto): void {
    abp.message.confirm(
      'Are you sure you want to delete customer "' + customer.customerName + '"?',
      'Are you sure?',
      (result: boolean) => {
        if (result) {
          // For now, just simulate deletion
          setTimeout(() => {
            this.notify.success(this.l('SuccessfullyDeleted'));
            this.getCustomers();
          }, 500);
        }
      }
    );
  }

  createCustomer(): void {
    this.createEditCustomerModal.show();
  }

  editCustomer(customer: CustomerDto): void {
    this.createEditCustomerModal.show(customer.id);
  }

  viewUsers(customer: CustomerDto): void {
    this.viewUsersModal.show(customer.id);
  }

  clearFilters(): void {
    this.keyword = '';
    this.pageNumber = 1;
    this.getCustomers();
  }

  getDataPage(event: any): void {
    this.pageNumber = Math.floor(event.first / event.rows) + 1;
    this.pageSize = event.rows;
    this.getCustomers();
  }

  refresh(): void {
    this.getCustomers();
  }

  getShownMinItemsCount(): number {
    return this.totalItems === 0 ? 0 : (this.pageNumber - 1) * this.pageSize + 1;
  }

  getShownMaxItemsCount(): number {
    return Math.min(this.pageNumber * this.pageSize, this.totalItems);
  }
}
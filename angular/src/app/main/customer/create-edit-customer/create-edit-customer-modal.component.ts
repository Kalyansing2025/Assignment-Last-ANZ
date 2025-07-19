import { Component, ViewChild, Injector, Output, EventEmitter, OnInit } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { AppComponentBase } from '@shared/common/app-component-base';
import { UserListDto, UserServiceProxy, GetUsersInput } from '@shared/service-proxies/service-proxies';
import { finalize } from 'rxjs/operators';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';

// Temporary customer classes until backend is implemented
export class CustomerDto {
  id?: number;
  customerName: string;
  emailId: string;
  phoneNumber: string;
  address: string;
  registrationDate: Date;
  assignedUsers?: UserListDto[];

  constructor() {
    this.customerName = '';
    this.emailId = '';
    this.phoneNumber = '';
    this.address = '';
    this.registrationDate = new Date();
  }
}

export class CreateOrEditCustomerDto {
  id?: number;
  customerName: string;
  emailId: string;
  phoneNumber: string;
  address: string;
  registrationDate: Date;
  userIds?: number[];

  constructor() {
    this.customerName = '';
    this.emailId = '';
    this.phoneNumber = '';
    this.address = '';
    this.registrationDate = new Date();
  }
}

@Component({
  selector: 'createEditCustomerModal',
  templateUrl: './create-edit-customer-modal.component.html'
})
export class CreateEditCustomerModalComponent extends AppComponentBase implements OnInit {

  @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;
  @Output() onSave = new EventEmitter<any>();

  customer: CreateOrEditCustomerDto = new CreateOrEditCustomerDto();
  availableUsers: UserListDto[] = [];
  selectedUserIds: number[] = [];
  
  id: number;
  saving = false;
  active = false;
  isDropdownOpen = false;
  userSearchText = '';
  
  datePickerConfig: Partial<BsDatepickerConfig> = {
    containerClass: 'theme-default',
    showWeekNumbers: false,
    dateInputFormat: 'DD/MM/YYYY'
  };

  constructor(
    injector: Injector,
    private _userService: UserServiceProxy
  ) {
    super(injector);
  }

  ngOnInit(): void {}

  show(id?: number): void {
    this.id = id;
    this.active = true;
    this.customer = new CreateOrEditCustomerDto();
    this.selectedUserIds = [];
    this.userSearchText = '';
    this.isDropdownOpen = false;

    this.loadAvailableUsers();

    if (!id) {
      this.customer.registrationDate = new Date();
      this.modal.show();
    } else {
      // For now, load an empty customer - this will be replaced with actual service call
      this.customer = new CreateOrEditCustomerDto();
      this.customer.id = id;
      this.modal.show();
    }
  }

  loadAvailableUsers(): void {
    // Load all users for now - this will be replaced with filtered users
    const input = new GetUsersInput();
    input.maxResultCount = 1000;
    input.skipCount = 0;
    
    this._userService.getUsers(input).subscribe((result) => {
      this.availableUsers = result.items;
    });
  }

  save(): void {
    this.saving = true;
    this.customer.userIds = this.selectedUserIds;

    // For now, just simulate saving - this will be replaced with actual customer service
    setTimeout(() => {
      this.saving = false;
      this.notify.success(this.l('SavedSuccessfully'));
      this.close();
      this.onSave.emit();
    }, 1000);
  }

  close(): void {
    this.active = false;
    this.modal.hide();
    this.customer = new CreateOrEditCustomerDto();
    this.selectedUserIds = [];
    this.isDropdownOpen = false;
  }

  isUserSelected(userId: number): boolean {
    return this.selectedUserIds.includes(userId);
  }

  onUserSelectionChange(userId: number, isSelected: boolean): void {
    if (isSelected) {
      if (!this.selectedUserIds.includes(userId)) {
        this.selectedUserIds.push(userId);
      }
    } else {
      const index = this.selectedUserIds.indexOf(userId);
      if (index > -1) {
        this.selectedUserIds.splice(index, 1);
      }
    }
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  getFilteredUsers(): UserListDto[] {
    if (!this.userSearchText) {
      return this.availableUsers;
    }
    
    const searchText = this.userSearchText.toLowerCase();
    return this.availableUsers.filter(user => 
      user.name.toLowerCase().includes(searchText) ||
      user.surname.toLowerCase().includes(searchText) ||
      user.emailAddress.toLowerCase().includes(searchText)
    );
  }

  getSelectedUserNames(): string[] {
    return this.selectedUserIds.map(id => {
      const user = this.availableUsers.find(u => u.id === id);
      return user ? `${user.name} ${user.surname}` : '';
    }).filter(name => name);
  }

  removeUser(userName: string): void {
    const user = this.availableUsers.find(u => `${u.name} ${u.surname}` === userName);
    if (user) {
      this.onUserSelectionChange(user.id, false);
    }
  }
}
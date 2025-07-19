import { Component, ViewChild, Injector, Output, EventEmitter } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { AppComponentBase } from '@shared/common/app-component-base';
import { UserListDto, UserServiceProxy, GetUsersInput } from '@shared/service-proxies/service-proxies';

@Component({
  selector: 'viewUsersModal',
  templateUrl: './view-users-modal.component.html'
})
export class ViewUsersModalComponent extends AppComponentBase {

  @ViewChild('viewUsersModal', { static: true }) modal: ModalDirective;

  customerUsers: UserListDto[] = [];
  customerName: string = '';
  active = false;
  loading = false;

  constructor(
    injector: Injector,
    private _userService: UserServiceProxy
  ) {
    super(injector);
  }

  show(customerId: number): void {
    this.active = true;
    this.loading = true;
    this.customerUsers = [];

    // For now, simulate loading users - this will be replaced with actual customer service
    // that returns users assigned to the specific customer
    const input = new GetUsersInput();
    input.maxResultCount = 100;
    input.skipCount = 0;
    
    this._userService.getUsers(input).subscribe((result) => {
      // Filter users assigned to this customer (placeholder logic)
      this.customerUsers = result.items.slice(0, 3); // Show first 3 users as demo
      this.customerName = `Customer ${customerId}`;
      this.loading = false;
      this.modal.show();
    });
  }

  close(): void {
    this.active = false;
    this.modal.hide();
  }
}
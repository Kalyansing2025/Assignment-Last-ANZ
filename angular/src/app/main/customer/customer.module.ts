import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppSharedModule } from '@app/shared/app-shared.module';
import { CustomerRoutingModule } from './customer-routing.module';
import { CustomerComponent } from './customer.component';
import { CreateEditCustomerModalComponent } from './create-edit-customer/create-edit-customer-modal.component';
import { ViewUsersModalComponent } from './view-users/view-users-modal.component';

@NgModule({
  declarations: [
    CustomerComponent,
    CreateEditCustomerModalComponent,
    ViewUsersModalComponent
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    AppSharedModule,
    CustomerRoutingModule
  ]
})
export class CustomerModule {}
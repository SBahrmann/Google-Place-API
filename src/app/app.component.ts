import { Component, ViewChild } from '@angular/core';

import { Address } from './google-place-autocomplete.directive';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  address!: Address;

  @ViewChild('autocompleteInput') autocompleteInput: any;

  handleAddressChange(address: Address) {
    console.log(address);
    this.address = address;
  }
}

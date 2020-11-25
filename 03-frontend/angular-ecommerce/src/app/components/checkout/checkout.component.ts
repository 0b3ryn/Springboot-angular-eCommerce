import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Luv2ShopFormService } from 'src/app/services/luv2-shop-form.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  checkoutFormGroup: FormGroup;
  totalPrice: number = 0.00;
  totalQuantity: number = 0;

  creditCardYears: Number[] = [];
  creditCardMonths: Number[] = [];


  constructor(private formBuilder: FormBuilder,
              private theLuv2ShopForm: Luv2ShopFormService) { }

  ngOnInit(): void {
    this.checkoutFormGroup = this.formBuilder.group({
        customer: this.formBuilder.group(
        {
          firstName: [''],
          lastName: [''],
          email: ['']
        }),

        shippingAddress: this.formBuilder.group(
          {
            country: [''],
            street: [''],
            city: [''],
            state: [''],
            zipCode: ['']
          }),

          billingAddress: this.formBuilder.group(
            {
              country: [''],
              street: [''],
              city: [''],
              state: [''],
              zipCode: ['']
            }),
            
            creditCardDetails: this.formBuilder.group(
              {
                cardType: [''],
                nameOnCard: [''],
                cardNumber: [''],
                securityCode: [''],
                expirationMonth: [''],
                expirationYear: ['']
              })
    });

    const startMonth: number = new Date().getMonth() +1;
    this.theLuv2ShopForm.getCreditCardMonths(startMonth).subscribe(
      data => {
        console.log("Retrieved credit card months: " + JSON.stringify(data));
        this.creditCardMonths = data;
      }
    );

    this.theLuv2ShopForm.getCreditCardYears().subscribe(
      data => {
        console.log("Retrieved credit card years: " + JSON.stringify(data));
        this.creditCardYears = data;
      }
    )
    
  }

  


  onSubmit(){

    console.log("handling the submit button");
    console.log(this.checkoutFormGroup.get('customer').value);
  }

  copyShippingAddressToBillingAddress(event){

    if (event.target.checked){
      this.checkoutFormGroup.controls.billingAddress.setValue(this.checkoutFormGroup.controls.shippingAddress.value);
    }
    else{
      this.checkoutFormGroup.controls.billingAddress.reset();
    }
  }



}

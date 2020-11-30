import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Country } from 'src/app/common/country';
import { State } from 'src/app/common/state';
import { Luv2ShopFormService } from 'src/app/services/luv2-shop-form.service';
import { Luv2shopValidators } from 'src/app/validators/luv2shop-validators';


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

  countries: Country[] = [];

  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];


  constructor(private formBuilder: FormBuilder,
              private theLuv2ShopForm: Luv2ShopFormService) { }

  ngOnInit(): void {
    this.checkoutFormGroup = this.formBuilder.group({
        customer: this.formBuilder.group(
        {
          firstName: new  FormControl('',
                              [Validators.required, Validators.minLength(2), Luv2shopValidators.notOnlyWhitespace]),
          lastName: new  FormControl('',
                              [Validators.required, Validators.minLength(2), Luv2shopValidators.notOnlyWhitespace]),
          email: new  FormControl('',
                      [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')])
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
    
    this.theLuv2ShopForm.getCountries().subscribe(
      data =>{
        console.log("Retrieved countries: "+JSON.stringify(data));
        this.countries = data;
      }
    )
    
  }

  


  onSubmit(){

    console.log("handling the submit button");

    if (this.checkoutFormGroup.invalid){
      this.checkoutFormGroup.markAllAsTouched();
    }

    console.log(this.checkoutFormGroup.get('customer').value);
    console.log("the email address is "+this.checkoutFormGroup.get('customer').value.email);
    console.log("the shipping address country is "+this.checkoutFormGroup.get('shippingAddress').value.country.name);
    console.log("the shipping address state is "+this.checkoutFormGroup.get('shippingAddress').value.state.name);
  }

  get firstName(){  return this.checkoutFormGroup.get('customer.firstName'); }
  get lastName(){  return this.checkoutFormGroup.get('customer.lastName'); }
  get email(){  return this.checkoutFormGroup.get('customer.email'); }
  

  copyShippingAddressToBillingAddress(event){

    if (event.target.checked){
      this.checkoutFormGroup.controls.billingAddress
            .setValue(this.checkoutFormGroup.controls.shippingAddress.value);

      this.billingAddressStates = this.shippingAddressStates;

    }
    else{
      this.checkoutFormGroup.controls.billingAddress.reset();
      this.billingAddressStates = [];
    }
  }

  handleMonthsAndYears(){
   
    const creditCardFormGroup = this.checkoutFormGroup.get('creditCardDetails');

    const currentYear: number = new Date().getFullYear();
    const selectedYear: number = Number(creditCardFormGroup.value.expirationYear);
    

    let startMonth: number;

    if (currentYear === selectedYear){
      startMonth = new Date().getMonth() + 1;
    }
    else{
      startMonth = 1;
    }

    this.theLuv2ShopForm.getCreditCardMonths(startMonth).subscribe(
      data => {
        console.log("Retrieved credit card months: " + JSON.stringify(data));
        this.creditCardMonths = data;
      }
    );
  }

  getStates(formGroupName: string){

    const formGroup = this.checkoutFormGroup.get(formGroupName);
    const countryCode = formGroup.value.country.code;
    const countryName = formGroup.value.country.name;

    console.log(formGroupName+' country code: '+ countryCode);
    console.log(formGroupName+' country name: '+ countryName);

    this.theLuv2ShopForm.getStates(countryCode).subscribe(
      data =>{
        if (formGroupName === 'shippingAddress'){
          this.shippingAddressStates = data;
        }
        else{
          this.billingAddressStates = data;
        }
        formGroup.get('state').setValue(data[0]);
      }
    );
  }

}

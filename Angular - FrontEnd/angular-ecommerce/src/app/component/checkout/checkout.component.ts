import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Order } from 'src/app/common/order';
import { OrderItem } from 'src/app/common/order-item';
import { Purchase } from 'src/app/common/purchase';
import { CartService } from 'src/app/services/cart.service';
import { CheckoutService } from 'src/app/services/checkout.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
})
export class CheckoutComponent implements OnInit {
  checkoutFormGroup!: FormGroup;

  totalPrice: number = 0;
  totalQuantity: number = 0;

  constructor(
    private formBuilder: FormBuilder,
    private cartService: CartService,
    private checkoutService: CheckoutService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.reviewCartDetails();

    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
        ]),
        lastName: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
        ]),
        email: new FormControl('', [
          Validators.required,
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
        ]),
      }),
      shippingAddress: this.formBuilder.group({
        street: new FormControl('', [Validators.required]),
        city: new FormControl('', [Validators.required]),
        state: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [Validators.required]),
      }),
      creditCart: this.formBuilder.group({
        cardType: new FormControl('', [Validators.required]),
        name: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
        ]),
        cardNumber: new FormControl('', [
          Validators.required,
          Validators.pattern('[0-9]{16}'),
        ]),
        securityCode: new FormControl('', [
          Validators.required,
          Validators.pattern('[0-9]{3}'),
        ]),
        expirationMonth: new FormControl('', [Validators.required]),
        expirationYear: new FormControl('', [Validators.required]),
      }),
    });
  }

  get customerFormGroup() {
    return this.checkoutFormGroup.get('customer') as FormGroup;
  }
  get shippindAddressFormGroup() {
    return this.checkoutFormGroup.get('shippingAddress') as FormGroup;
  }
  get creditCartFormGroup() {
    return this.checkoutFormGroup.get('creditCart') as FormGroup;
  }

  get firstName() {
    return this.customerFormGroup.get('firstName');
  }
  get lastName() {
    return this.customerFormGroup.get('lastName');
  }
  get email() {
    return this.customerFormGroup.get('email');
  }

  get street() {
    return this.shippindAddressFormGroup.get('street');
  }
  get city() {
    return this.shippindAddressFormGroup.get('city');
  }
  get state() {
    return this.shippindAddressFormGroup.get('state');
  }
  get country() {
    return this.shippindAddressFormGroup.get('country');
  }
  get zipCode() {
    return this.shippindAddressFormGroup.get('zipCode');
  }

  get cardType() {
    return this.creditCartFormGroup.get('cardType')
  }
  get name() {
    return this.creditCartFormGroup.get('name')
  }
  get cardNumber() {
    return this.creditCartFormGroup.get('cardNumber')
  }
  get securityCode() {
    return this.creditCartFormGroup.get('securityCode')
  }
  get expirationMonth() {
    return this.creditCartFormGroup.get('expirationMonth')
  }
  get expirationYear() {
    return this.creditCartFormGroup.get('expirationYear')
  }

  reviewCartDetails() {
    this.cartService.totalPrice.subscribe(
      (totalPrice) => (this.totalPrice = totalPrice)
    );

    this.cartService.totalQuantity.subscribe(
      (totalQuantity) => (this.totalQuantity = totalQuantity)
    );
  }

  onSubmit() {
    if (this.checkoutFormGroup.invalid) {
      this.checkoutFormGroup.markAllAsTouched();
      return;
    }

    let order = new Order();
    order.totalPrice = this.totalPrice;
    order.totalQuantity = this.totalQuantity;

    const cartItem = this.cartService.cartItems;

    let orderItems: OrderItem[] = [];
    for (let i = 0; i < cartItem.length; i++) {
      orderItems[i] = new OrderItem(cartItem[i]);
    }
    console.log(cartItem);

    let purchase = new Purchase();

    purchase.customer = this.checkoutFormGroup.controls['customer'].value;

    purchase.shippingAddress =
      this.checkoutFormGroup.controls['shippingAddress'].value;

    purchase.order = order;
    purchase.orderItem = orderItems;

    this.checkoutService.placeOrder(purchase).subscribe({
      next: (response) => {
        alert(
          `Your order has been received. Order tracking number: ${response.orderTrackingNumber}`
        );

        this.resetCard();
      },
      error: (err) => {
        alert(`There was an error: ${err.message}`);
      },
    });
  }
  resetCard() {
    this.cartService.cartItems = [];
    this.cartService.totalPrice.next(0);
    this.cartService.totalQuantity.next(0);
    this.checkoutFormGroup.reset();
    this.router.navigateByUrl('/products');
  }
}

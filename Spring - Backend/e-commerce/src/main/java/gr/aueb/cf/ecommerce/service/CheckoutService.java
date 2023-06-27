package gr.aueb.cf.ecommerce.service;

import gr.aueb.cf.ecommerce.dto.Purchase;
import gr.aueb.cf.ecommerce.dto.PurchaseResponse;

public interface CheckoutService {

    PurchaseResponse placeOrder(Purchase purchase);
}

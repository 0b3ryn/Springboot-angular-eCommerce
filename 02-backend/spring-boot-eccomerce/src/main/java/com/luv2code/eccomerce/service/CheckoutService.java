package com.luv2code.eccomerce.service;

import com.luv2code.eccomerce.dto.Purchase;
import com.luv2code.eccomerce.dto.PurchaseResponse;

public interface CheckoutService {

    PurchaseResponse placeOrder(Purchase purchase);
}

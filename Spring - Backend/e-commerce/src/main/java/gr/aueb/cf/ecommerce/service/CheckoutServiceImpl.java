package gr.aueb.cf.ecommerce.service;

import gr.aueb.cf.ecommerce.dao.CustomerRepo;
import gr.aueb.cf.ecommerce.dto.Purchase;
import gr.aueb.cf.ecommerce.dto.PurchaseResponse;
import gr.aueb.cf.ecommerce.entity.Customer;
import gr.aueb.cf.ecommerce.entity.Order;
import gr.aueb.cf.ecommerce.entity.OrderItem;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;
import java.util.UUID;

@Service
public class CheckoutServiceImpl implements CheckoutService {

    private CustomerRepo customerRepo;

    public CheckoutServiceImpl(CustomerRepo customerRepo) {
        this.customerRepo = customerRepo;
    }

    @Override
    @Transactional
    public PurchaseResponse placeOrder(Purchase purchase) {
        Order order = purchase.getOrder();
        String orderTrackingNumber = generateOrderTrackingNumber();
        order.setOrderTrackingNumber(orderTrackingNumber);

        Set<OrderItem> orderItems = purchase.getOrderItem();
        System.out.println(orderItems);
        orderItems.forEach(item ->order.add(item));
        System.out.println(orderItems);

        order.setShippingAddress(purchase.getShippingAddress());

        Customer customer = purchase.getCustomer();
        customer.add(order);

        customerRepo.save(customer);
        return new PurchaseResponse(orderTrackingNumber);
    }

    private String generateOrderTrackingNumber() {
        return UUID.randomUUID().toString();
    }
}

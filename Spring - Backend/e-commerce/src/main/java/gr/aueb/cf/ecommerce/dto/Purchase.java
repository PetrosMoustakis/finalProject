package gr.aueb.cf.ecommerce.dto;

import gr.aueb.cf.ecommerce.entity.Address;
import gr.aueb.cf.ecommerce.entity.Customer;
import gr.aueb.cf.ecommerce.entity.Order;
import gr.aueb.cf.ecommerce.entity.OrderItem;
import lombok.Data;

import java.util.Set;

@Data
public class Purchase {

    private Customer customer;
    private Address shippingAddress;
    private Order order;
    private Set<OrderItem> orderItem;
}

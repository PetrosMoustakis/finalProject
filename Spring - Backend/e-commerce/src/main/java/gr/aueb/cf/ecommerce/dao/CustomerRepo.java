package gr.aueb.cf.ecommerce.dao;

import gr.aueb.cf.ecommerce.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.CrossOrigin;

@Repository
@CrossOrigin("http://localhost:4200")
public interface CustomerRepo extends JpaRepository<Customer, Long> {
}

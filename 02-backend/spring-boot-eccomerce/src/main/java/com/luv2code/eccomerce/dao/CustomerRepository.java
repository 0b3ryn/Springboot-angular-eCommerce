package com.luv2code.eccomerce.dao;

import com.luv2code.eccomerce.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CustomerRepository extends JpaRepository<Customer,Long> {

}

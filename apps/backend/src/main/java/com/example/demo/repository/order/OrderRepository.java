package com.example.demo.repository.order;

import com.example.demo.entity.Order;
import com.example.demo.enumValues.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findByRenterIdOrderByCreatedAtDesc(Long renterId);

    List<Order> findByStatus(OrderStatus status);
}

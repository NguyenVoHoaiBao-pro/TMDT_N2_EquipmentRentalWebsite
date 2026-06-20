package com.example.demo.repository.order;

import com.example.demo.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;

interface OrderRepository extends JpaRepository<Order, Long> {
}

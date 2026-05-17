package com.example.demo.repository;

import com.example.demo.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;

interface IOrderRepository extends JpaRepository<Order, Long> {
}

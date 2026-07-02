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

    // Find distinct orders that contain devices owned by a specific owner
    @org.springframework.data.jpa.repository.Query("SELECT DISTINCT o FROM Order o JOIN o.orderDetails d WHERE d.device.owner.id = :ownerId ORDER BY o.createdAt DESC")
    java.util.List<Order> findOrdersByOwnerId(@org.springframework.data.repository.query.Param("ownerId") Long ownerId);
}

package com.example.demo.repository.order;

import com.example.demo.entity.Order;
import com.example.demo.enumValues.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> { // Chuyển thành public

    // Tìm tất cả đơn hàng của một người thuê (Renter)
    List<Order> findByRenterId(Long renterId);

    // Tìm các đơn hàng theo trạng thái (Phục vụ việc xử lý đơn hàng: PENDING, CONFIRMED...)
    List<Order> findByStatus(OrderStatus status);
}

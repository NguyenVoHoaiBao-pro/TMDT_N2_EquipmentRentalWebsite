package com.example.demo.repository.order;

import com.example.demo.entity.OrderDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderDetailRepository extends JpaRepository<OrderDetail, Long> {

    // Tìm lịch sử thuê của một máy cụ thể
    List<OrderDetail> findByDeviceId(Long deviceId);
}

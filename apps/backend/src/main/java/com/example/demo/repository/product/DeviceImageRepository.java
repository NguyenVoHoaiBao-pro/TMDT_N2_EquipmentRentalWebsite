package com.example.demo.repository.product;

import com.example.demo.entity.DeviceImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DeviceImageRepository extends JpaRepository<DeviceImage, Long> {
}

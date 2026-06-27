package com.example.demo.repository.product;

import com.example.demo.entity.Device;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface DeviceRepository extends JpaRepository<Device, Long> {

    @Query("SELECT d FROM Device d WHERE d.owner.id = :ownerId")
    List<Device> findByOwnerId(Long ownerId);

}

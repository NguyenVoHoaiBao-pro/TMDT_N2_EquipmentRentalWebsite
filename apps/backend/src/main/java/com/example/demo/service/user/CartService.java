package com.example.demo.service.user;

import com.example.demo.entity.Device;
import com.example.demo.entity.User;
import com.example.demo.repository.product.DeviceRepository;
import com.example.demo.repository.user.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;

@Service
@RequiredArgsConstructor
public class CartService {

//    private final UserRepository userRepository;
//    private final DeviceRepository deviceRepository;
//
//    @Transactional
//    public void addToCart(Long userId, Long deviceId) {
//        User user = userRepository.findById(userId)
//            .orElseThrow(() -> new EntityNotFoundException("User not found"));
//        Device device = deviceRepository.findById(deviceId)
//            .orElseThrow(() -> new EntityNotFoundException("Device not found"));
//
//        user.getCartItems().add(device);
//        userRepository.save(user); // JPA tự động đồng bộ xuống bảng trung gian cart_items
//    }
//
//    @Transactional
//    public void removeFromCart(Long userId, Long deviceId) {
//        User user = userRepository.findById(userId)
//            .orElseThrow(() -> new EntityNotFoundException("User not found"));
//
//        user.getCartItems().removeIf(device -> device.getId().equals(deviceId));
//        userRepository.save(user);
//    }
//
//    @Transactional(readOnly = true)
//    public Set<Device> getCartContent(Long userId) {
//        User user = userRepository.findById(userId)
//            .orElseThrow(() -> new EntityNotFoundException("User not found"));
//        return user.getCartItems();
//    }
}

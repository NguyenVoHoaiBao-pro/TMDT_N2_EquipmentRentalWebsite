package com.example.demo.service.review;

import com.example.demo.entity.Order;
import com.example.demo.entity.Product;
import com.example.demo.entity.ProductReview;
import com.example.demo.entity.User;
import com.example.demo.entity.UserReview;
import com.example.demo.repository.order.OrderRepository;
import com.example.demo.repository.product.ProductRepository; // Nhớ import Repo này nếu cần validate Product
import com.example.demo.repository.review.ProductReviewRepository;
import com.example.demo.repository.review.UserReviewRepository;
import com.example.demo.repository.user.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ProductReviewRepository productReviewRepository;
    private final UserReviewRepository userReviewRepository;
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    @Transactional
    public ProductReview createProductReview(Long orderId, Long renterId, Long productId, Integer rating, String comment) {
        Order order = orderRepository.findById(orderId)
            .orElseThrow(() -> new EntityNotFoundException("Order not found"));
        User renter = userRepository.findById(renterId)
            .orElseThrow(() -> new EntityNotFoundException("Renter not found"));
        Product product = productRepository.findById(productId)
            .orElseThrow(() -> new EntityNotFoundException("Product not found"));

        ProductReview productReview = ProductReview.builder()
            .order(order)
            .renter(renter)
            .product(product)
            .rating(rating)
            .comment(comment)
            .build();

        return productReviewRepository.save(productReview);
    }

    @Transactional
    public UserReview createUserReview(Long orderId, Long ownerId, Long renterId, Integer rating, String comment) {
        Order order = orderRepository.findById(orderId)
            .orElseThrow(() -> new EntityNotFoundException("Order not found"));
        User owner = userRepository.findById(ownerId)
            .orElseThrow(() -> new EntityNotFoundException("Owner not found"));
        User renter = userRepository.findById(renterId)
            .orElseThrow(() -> new EntityNotFoundException("Renter not found"));

        UserReview userReview = UserReview.builder()
            .order(order)
            .owner(owner)
            .renter(renter)
            .rating(rating)
            .comment(comment)
            .build();

        UserReview savedReview = userReviewRepository.save(userReview);

        updateUserTrustScore(renterId);

        return savedReview;
    }

    private void updateUserTrustScore(Long renterId) {
        User renter = userRepository.findById(renterId)
            .orElseThrow(() -> new EntityNotFoundException("Renter not found"));

        Double avgRating = userReviewRepository.getAverageRatingByRenterId(renterId);
        if (avgRating != null) {
            renter.setTrustScore(BigDecimal.valueOf(avgRating));
            userRepository.save(renter);
        }
    }
}

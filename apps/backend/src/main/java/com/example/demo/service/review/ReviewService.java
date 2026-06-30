package com.example.demo.service.review;

import com.example.demo.entity.Order;
import com.example.demo.entity.Review;
import com.example.demo.entity.User;
import com.example.demo.enumValues.ReviewType;
import com.example.demo.repository.order.OrderRepository;
import com.example.demo.repository.review.ReviewRepository;
import com.example.demo.repository.user.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;

    @Transactional
    public Review createReview(Long orderId, Long authorId, Long targetId, ReviewType reviewType, Integer rating, String comment) {
        Order order = orderRepository.findById(orderId)
            .orElseThrow(() -> new EntityNotFoundException("Order not found"));
        User author = userRepository.findById(authorId)
            .orElseThrow(() -> new EntityNotFoundException("Author not found"));

        Review review = Review.builder()
            .order(order)
            .author(author)
            .targetId(targetId)
            .reviewType(reviewType)
            .rating(rating)
            .comment(comment)
            .build();

        Review savedReview = reviewRepository.save(review);

        // Nếu chủ máy review người thuê, tính toán lại trust_score cho người thuê đó
        if (reviewType == ReviewType.OWNER_TO_RENTER) {
            updateUserTrustScore(targetId);
        }

        return savedReview;
    }

    private void updateUserTrustScore(Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new EntityNotFoundException("User not found"));

        Double avgRating = reviewRepository.getAverageRating(userId, ReviewType.OWNER_TO_RENTER);
        if (avgRating != null) {
            user.setTrustScore(BigDecimal.valueOf(avgRating));
            userRepository.save(user);
        }
    }
}

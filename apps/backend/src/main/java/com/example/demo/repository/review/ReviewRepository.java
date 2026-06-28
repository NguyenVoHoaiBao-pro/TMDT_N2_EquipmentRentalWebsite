package com.example.demo.repository.review;

import com.example.demo.entity.Review;
import com.example.demo.enumValues.ReviewType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {

    // Lấy tất cả các đánh giá hướng tới một mục tiêu (User hoặc Device) theo loại
    List<Review> findByTargetIdAndReviewType(Long targetId, ReviewType reviewType);

    // Tính điểm trung bình rating của một target (Dùng để cập nhật trust_score hoặc hiển thị rating của máy)
    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.targetId = :targetId AND r.reviewType = :reviewType")
    Double getAverageRating(@Param("targetId") Long targetId, @Param("reviewType") ReviewType reviewType);
}

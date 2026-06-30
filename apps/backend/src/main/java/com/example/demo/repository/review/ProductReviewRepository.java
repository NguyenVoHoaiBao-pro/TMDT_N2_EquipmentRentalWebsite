package com.example.demo.repository.review;

import com.example.demo.entity.ProductReview;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductReviewRepository extends JpaRepository<ProductReview, Long> {

    // Lấy các đánh giá mới nhất của một Dòng sản phẩm (Product) dựa trên Device ID
    @Query("SELECT pr FROM ProductReview pr " +
        "JOIN FETCH pr.renter " +
        "WHERE pr.product.id = (SELECT d.product.id FROM Device d WHERE d.id = :deviceId) " +
        "ORDER BY pr.createdAt DESC")
    List<ProductReview> findLatestReviewsByDeviceId(@Param("deviceId") Long deviceId, Pageable pageable);

    // Tính điểm trung bình rating của một Dòng sản phẩm (Product)
    @Query("SELECT AVG(pr.rating) FROM ProductReview pr WHERE pr.product.id = :productId")
    Double getAverageRatingByProductId(@Param("productId") Long productId);
}

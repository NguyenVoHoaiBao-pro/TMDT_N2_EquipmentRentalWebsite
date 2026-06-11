package com.example.demo.repository;

import com.example.demo.entity.ProductItemCalendar;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface IProductItemCalendarRepository extends JpaRepository<ProductItemCalendar, Long> {

    // 1. Kiểm tra xem có bao nhiêu ngày trong danh sách yêu cầu đã bị trùng lịch
    @Query("SELECT COUNT(c) FROM ProductItemCalendar c " +
        "WHERE c.productItem.id = :itemId " +
        "AND c.eventDate IN :requestedDates")
    long countBlockedDates(@Param("itemId") Long itemId,
                           @Param("requestedDates") List<LocalDate> requestedDates);

    // 2. Lấy danh sách ngày bận từ hôm nay trở đi để hiển thị lên UI lịch
    @Query("SELECT c.eventDate FROM ProductItemCalendar c " +
        "WHERE c.productItem.id = :itemId AND c.eventDate >= CURRENT_DATE")
    List<LocalDate> findAllBlockedDatesFromToday(@Param("itemId") Long itemId);
}

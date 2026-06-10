package com.example.demo.entity;

import com.example.demo.enumValues.ProductItemCalendarStatus;
import jakarta.persistence.*;
import lombok.*;

import java.io.Serial;
import java.time.LocalDate;

@Table(name = "product_item_calendar")
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductItemCalendar extends BaseEntity {

    @Serial
    private static final long serialVersionUID = 1L;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_item_id", nullable = false)
    private ProductItem productItem;

    @Column(name = "event_date", nullable = false)
    private LocalDate eventDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private ProductItemCalendarStatus status;
}

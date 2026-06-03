package com.example.demo.entity;

import com.example.demo.enumValues.ProductItemStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.io.Serial;
import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Map;

@Table(name = "product_items")
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class ProductItem extends BaseEntity implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner;

    @Column(name = "serial_number")
    private String serialNumber;

    @Column(name = "condition_percent")
    private Integer conditionPercent;

    @Column(name = "price_per_day", nullable = false, precision = 10, scale = 2)
    private BigDecimal pricePerDay;

    @Column(name = "deposit_value", precision = 10, scale = 2)
    private BigDecimal depositValue;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private ProductItemStatus status;
}

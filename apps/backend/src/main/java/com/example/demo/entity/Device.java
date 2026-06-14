package com.example.demo.entity;

import com.example.demo.enumValues.DeviceStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.BatchSize;

import java.io.Serial;
import java.io.Serializable;
import java.math.BigDecimal;
import java.util.HashSet;
import java.util.Set;

@Table(name = "devices")
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class Device extends BaseEntity implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner;

    @Column(name = "serial_number", nullable = false)
    private String serialNumber;

    @Column(name = "condition_percent", nullable = false)
    private Integer conditionPercent;

    @Column(name = "price_per_day", nullable = false, precision = 15, scale = 2)
    private BigDecimal pricePerDay;

    @Column(name = "deposit_value", nullable = false, precision = 15, scale = 2)
    private BigDecimal depositValue;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private DeviceStatus status;

    @OneToMany(mappedBy = "device", cascade = CascadeType.ALL)
    @Builder.Default
    private Set<DeviceImage> deviceImages = new HashSet<>();

    @OneToMany(mappedBy = "device", cascade = CascadeType.ALL)
    @Builder.Default
    @BatchSize(size = 50)
    private Set<DeviceCalendar> deviceCalendar = new HashSet<>();
}

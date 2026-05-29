package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.*;

import java.io.Serial;
import java.io.Serializable;

@Table(name = "product_details")
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class ProductDetail extends BaseEntity implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    private Product product;

    private String brand;

    private String model;

    @Column(name = "lens_mount")
    private String lensMount;

    private String specifications;

    private String accessories;
}

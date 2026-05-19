package com.example.demo.enumValues;

import lombok.Getter;

@Getter
public enum ProductStatus {

    AVAILABLE("Available", "Product is available for rent"),
    RENTED("Rented", "Product is currently rented out"),
    MAINTENANCE("Maintenance", "Product is under maintenance and not available for rent");

    private final String label;
    private final String value;

    ProductStatus(String label, String value) {
        this.label = label;
        this.value = value;
    }

}

package com.example.demo.enumValues;

import lombok.Getter;

@Getter
public enum ProductItemStatus {

    AVAILABLE("Available", "Product item is available"),
    RENTED("Rented", "Product item is currently rented out"),
    MAINTENANCE("Maintenance", "Product item is under maintenance and not available"),
    DAMAGED("Damaged", "Product item is damaged and requires repair");


    private final String label;
    private final String value;

    ProductItemStatus(String label, String value) {
        this.label = label;
        this.value = value;
    }
}

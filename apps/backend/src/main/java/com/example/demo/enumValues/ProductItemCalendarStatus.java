package com.example.demo.enumValues;

import lombok.Getter;

@Getter
public enum ProductItemCalendarStatus {

    BOOKED("Booked", "This product item is booked"),
    OWNER_BLOCK("Owner Block", "This product item is blocked by the owner"),
    MAINTENANCE("Maintenance", "This product item is under maintenance");

    private final String label;
    private final String value;

    ProductItemCalendarStatus(String label, String value) {
        this.label = label;
        this.value = value;
    }
}

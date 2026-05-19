package com.example.demo.enumValues;

import lombok.Getter;

@Getter
public enum OrderStatus {

    PENDING("Pending", "Order is pending and awaiting confirmation"),
    CONFIRMED("Confirmed", "Order has been confirmed by the owner"),
    CANCELLED("Cancelled", "Order has been cancelled by the renter or owner"),
    COMPLETED("Completed", "Order has been completed successfully"),
    ONGOING("Ongoing", "Order is currently ongoing and active");;

    private final String label;
    private final String value;

    OrderStatus(String label, String value) {
        this.label = label;
        this.value = value;
    }

}

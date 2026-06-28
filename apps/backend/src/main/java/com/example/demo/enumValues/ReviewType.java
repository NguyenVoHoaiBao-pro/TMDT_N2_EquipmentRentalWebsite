package com.example.demo.enumValues;

import lombok.Getter;

@Getter
public enum ReviewType {

    RENTER_TO_ITEM("Renter to item", "Rating given by the renter to the item"),
    OWNER_TO_RENTER("Owner to renter", "Rating given by the owner to the renter");


    private final String label;
    private final String value;

    ReviewType(String label, String value) {
        this.label = label;
        this.value = value;

    }
}

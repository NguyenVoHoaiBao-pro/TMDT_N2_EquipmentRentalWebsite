package com.example.demo.utils;

import static com.example.demo.constants.ValidationConstants.PASSWORD_PATTERN;

public class PasswordUtils {

    public boolean isValidPassword(String password) {
        return password.matches(PASSWORD_PATTERN);
    }
}

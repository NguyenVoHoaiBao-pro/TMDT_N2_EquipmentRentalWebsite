package com.example.demo.config.crypto;

import com.example.demo.utils.CryptoUtils;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import lombok.Setter;

@Converter
public class AesDataConverter implements AttributeConverter<String, String> {

    @Setter
    private static CryptoUtils cryptoUtil;

    @Override
    public String convertToDatabaseColumn(String attribute) {
        if (attribute == null) return null;
        return cryptoUtil.encrypt(attribute);
    }

    @Override
    public String convertToEntityAttribute(String dbData) {
        if (dbData == null) return null;
        return cryptoUtil.decrypt(dbData);
    }
}

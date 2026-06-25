package com.example.demo.config.crypto;

import com.example.demo.utils.CryptoUtils;
import jakarta.annotation.PostConstruct;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AesConverterInitializer {

    private final CryptoUtils cryptoUtil;

    public AesConverterInitializer(CryptoUtils cryptoUtil) {
        this.cryptoUtil = cryptoUtil;
    }

    @PostConstruct
    public void init() {
        AesDataConverter.setCryptoUtil(cryptoUtil);
    }
}

package com.paragon.project1.web.rest;

import com.paragon.project1.config.ApplicationProperties;
import com.paragon.project1.service.dto.StoreConfigurationView;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/** Exposes the small set of non-sensitive values required by the storefront. */
@RestController
@RequestMapping("/api/store-config")
public class StoreConfigurationResource {

    private final String whatsappNumber;

    public StoreConfigurationResource(ApplicationProperties applicationProperties) {
        this.whatsappNumber = applicationProperties.getStore().getWhatsappNumber().replaceAll("\\D", "");
    }

    @GetMapping
    public ResponseEntity<StoreConfigurationView> getStoreConfiguration() {
        return ResponseEntity.ok(new StoreConfigurationView(whatsappNumber));
    }
}

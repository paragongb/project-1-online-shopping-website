package com.paragon.project1.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * Properties specific to Project 1 Online Shopping Website.
 * <p>
 * Properties are configured in the {@code application.yml} file.
 * See {@link tech.jhipster.config.JHipsterProperties} for a good example.
 */
@ConfigurationProperties(prefix = "application", ignoreUnknownFields = false)
public class ApplicationProperties {

    private final Liquibase liquibase = new Liquibase();

    private final Store store = new Store();

    // jhipster-needle-application-properties-property

    public Liquibase getLiquibase() {
        return liquibase;
    }

    public Store getStore() {
        return store;
    }

    // jhipster-needle-application-properties-property-getter

    public static class Liquibase {

        private Boolean asyncStart = true;

        public Boolean getAsyncStart() {
            return asyncStart;
        }

        public void setAsyncStart(Boolean asyncStart) {
            this.asyncStart = asyncStart;
        }
    }

    public static class Store {

        private String whatsappNumber;

        public String getWhatsappNumber() {
            return whatsappNumber;
        }

        public void setWhatsappNumber(String whatsappNumber) {
            this.whatsappNumber = whatsappNumber;
        }
    }

    // jhipster-needle-application-properties-property-class
}

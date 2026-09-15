package com.paragon.project1.config;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.boot.test.context.runner.ApplicationContextRunner;
import org.springframework.context.annotation.Configuration;

class ApplicationPropertiesTest {

    private final ApplicationContextRunner contextRunner = new ApplicationContextRunner().withUserConfiguration(TestConfiguration.class);

    @Test
    void bindsStoreWhatsappNumber() {
        contextRunner.withPropertyValues("application.store.whatsapp-number=601151811980").run(context -> {
            assertThat(context).hasNotFailed();
            assertThat(context.getBean(ApplicationProperties.class).getStore().getWhatsappNumber()).isEqualTo("601151811980");
        });
    }

    @Configuration(proxyBeanMethods = false)
    @EnableConfigurationProperties(ApplicationProperties.class)
    static class TestConfiguration {}
}

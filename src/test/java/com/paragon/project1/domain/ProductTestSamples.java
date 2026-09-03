package com.paragon.project1.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;

public class ProductTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + 2L * Integer.MAX_VALUE);
    private static final AtomicInteger intCount = new AtomicInteger(random.nextInt() + 2 * Short.MAX_VALUE);

    public static Product getProductSample1() {
        return new Product().id(1L).sku("sku1").name("name1").stockQuantity(1);
    }

    public static Product getProductSample2() {
        return new Product().id(2L).sku("sku2").name("name2").stockQuantity(2);
    }

    public static Product getProductRandomSampleGenerator() {
        return new Product()
            .id(longCount.incrementAndGet())
            .sku(UUID.randomUUID().toString())
            .name(UUID.randomUUID().toString())
            .stockQuantity(intCount.incrementAndGet());
    }
}

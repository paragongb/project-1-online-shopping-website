package com.paragon.project1.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class AddressTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + 2L * Integer.MAX_VALUE);

    public static Address getAddressSample1() {
        return new Address()
            .id(1L)
            .addressLine1("addressLine11")
            .addressLine2("addressLine21")
            .city("city1")
            .state("state1")
            .postalCode("postalCode1")
            .country("country1");
    }

    public static Address getAddressSample2() {
        return new Address()
            .id(2L)
            .addressLine1("addressLine12")
            .addressLine2("addressLine22")
            .city("city2")
            .state("state2")
            .postalCode("postalCode2")
            .country("country2");
    }

    public static Address getAddressRandomSampleGenerator() {
        return new Address()
            .id(longCount.incrementAndGet())
            .addressLine1(UUID.randomUUID().toString())
            .addressLine2(UUID.randomUUID().toString())
            .city(UUID.randomUUID().toString())
            .state(UUID.randomUUID().toString())
            .postalCode(UUID.randomUUID().toString())
            .country(UUID.randomUUID().toString());
    }
}

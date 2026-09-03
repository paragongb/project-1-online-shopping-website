package com.paragon.project1.service.mapper;

import com.paragon.project1.domain.CustomerOrder;
import com.paragon.project1.domain.OrderItem;
import com.paragon.project1.domain.Product;
import com.paragon.project1.service.dto.CustomerOrderDTO;
import com.paragon.project1.service.dto.OrderItemDTO;
import com.paragon.project1.service.dto.ProductDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link OrderItem} and its DTO {@link OrderItemDTO}.
 */
@Mapper(componentModel = "spring")
public interface OrderItemMapper extends EntityMapper<OrderItemDTO, OrderItem> {
    @Mapping(target = "product", source = "product", qualifiedByName = "productName")
    @Mapping(target = "order", source = "order", qualifiedByName = "customerOrderId")
    OrderItemDTO toDto(OrderItem s);

    @Named("productName")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    @Mapping(target = "name", source = "name")
    ProductDTO toDtoProductName(Product product);

    @Named("customerOrderId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    CustomerOrderDTO toDtoCustomerOrderId(CustomerOrder customerOrder);
}

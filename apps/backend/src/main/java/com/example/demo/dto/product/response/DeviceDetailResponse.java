//package com.example.demo.dto.product.response;
//
//import java.math.BigDecimal;
//import java.util.List;
//
//public record ProductInformationDto(Long id, String name, String slug, String description,
//                                    List<SpecificationDto> specifications, List<String> includedItems) {
//}
//
//public record DeviceInformationDto(Long id, Long ownerId, int conditionPercent, String availability,
//                                   BigDecimal pricePerDay, BigDecimal depositValue, List<DeviceImageDto> images) {
//}
//
//public record DeviceDetailResponse(
//    ProductInformationDto product,
//    DeviceInformationDto device,
//    OwnerDto owner,
//    List<ReviewDto> reviews
//) {
//}

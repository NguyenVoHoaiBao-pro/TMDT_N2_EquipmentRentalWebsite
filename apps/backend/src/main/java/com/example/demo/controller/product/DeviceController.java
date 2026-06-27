package com.example.demo.controller.product;

import com.example.demo.controller.BaseController;
import com.example.demo.dto.MyApiResponse;
import com.example.demo.dto.product.request.DeviceRequest;
import com.example.demo.dto.product.response.DeviceManageResponse;
import com.example.demo.security.CustomUserDetails;
import com.example.demo.service.product.DeviceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/devices")
@RequiredArgsConstructor
public class DeviceController extends BaseController {

    private final DeviceService deviceService;

    @PreAuthorize("hasRole('OWNER')")
    @PostMapping
    public ResponseEntity<MyApiResponse<Void>> createDevice(
        @RequestBody DeviceRequest request,
        @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        Long userId = userDetails.getId(); // Get through Lombok Getter
        deviceService.createProductItem(request, userId);
        return createResponse(HttpStatus.CREATED, 1000, "Register new device successfully", null);
    }

    @PreAuthorize("hasRole('OWNER')")
    @GetMapping("/my-inventory")
    public ResponseEntity<MyApiResponse<List<DeviceManageResponse>>> getMyInventory(
        @AuthenticationPrincipal CustomUserDetails userDetails // Retrieve owner ID from a security context
    ) {
        Long ownerId = userDetails.getId();
        List<DeviceManageResponse> inventory = deviceService.getDevicesByOwner(ownerId);
        return createResponse(HttpStatus.OK, 1000, "Fetch owner inventory successfully", inventory);
    }

    @PutMapping("/{id}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MyApiResponse<Void>> approveDevice(@PathVariable Long id) {
        deviceService.approveProductItem(id);
        return createResponse(HttpStatus.OK, 1000, "Approve device successfully", null);
    }

//    @GetMapping("/{id}/detail")
//    @io.swagger.v3.oas.annotations.security.SecurityRequirements
//    public ResponseEntity<MyApiResponse<com.example.demo.dto.product.response.DeviceDetailResponse>> getDeviceDetailById(@PathVariable Long id) {
//        return createResponse(HttpStatus.OK, 1000, "Success", deviceService.getDeviceDetail(id));
//    }


}

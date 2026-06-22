package com.example.demo.controller.product;

import com.example.demo.controller.BaseController;
import com.example.demo.dto.MyApiResponse;
import com.example.demo.dto.product.request.DeviceRequest;
import com.example.demo.security.CustomUserDetails;
import com.example.demo.service.product.DeviceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

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

    @PutMapping("/{id}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MyApiResponse<Void>> approveDevice(@PathVariable Long id) {
        deviceService.approveProductItem(id);
        return createResponse(HttpStatus.OK, 1000, "Approve device successfully", null);
    }
}

package com.example.demo.controller.payment;

import com.example.demo.controller.BaseController;
import com.example.demo.dto.MyApiResponse;
import com.example.demo.service.payment.PaymentService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Enumeration;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/payments")
@RequiredArgsConstructor
public class PaymentController extends BaseController {

    private final Map<String, PaymentService> paymentStrategies;
    private final com.example.demo.repository.payment.PaymentRepository paymentRepository;
    private final com.example.demo.repository.order.OrderRepository orderRepository;

    @GetMapping("/vnpay/ipn")
    @org.springframework.transaction.annotation.Transactional
    public ResponseEntity<MyApiResponse<Map<String, String>>> receiveVnPayIpn(HttpServletRequest request) {
        Map<String, String> params = new HashMap<>();
        Enumeration<String> parameterNames = request.getParameterNames();
        while (parameterNames.hasMoreElements()) {
            String paramName = parameterNames.nextElement();
            params.put(paramName, request.getParameter(paramName));
        }

        PaymentService vnPayService = paymentStrategies.get("VNPAYPaymentService");
        boolean isProcessedSuccess = vnPayService.processCallback(params);

        Map<String, String> vnpayResponse = new HashMap<>();

        if (isProcessedSuccess) {
            String paymentToken = params.get("vnp_TxnRef");
            String transactionId = params.get("vnp_TransactionNo");

            com.example.demo.entity.Payment payment = paymentRepository.findByPaymentToken(paymentToken)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy phiên giao dịch!"));

            if (payment.getStatus() != com.example.demo.enumValues.PaymentStatus.SUCCESS) {
                payment.setStatus(com.example.demo.enumValues.PaymentStatus.SUCCESS);
                payment.setTransactionId(transactionId);
                payment.setPaidAt(java.time.Instant.now());
                payment.setResponseMetadata(params.toString());
                paymentRepository.save(payment);

                com.example.demo.entity.Order order = payment.getOrder();
                order.setStatus(com.example.demo.enumValues.OrderStatus.PAID);
                orderRepository.save(order);
            }

            vnpayResponse.put("RspCode", "00");
            vnpayResponse.put("Message", "Confirm Success");

            return createResponse(HttpStatus.OK, 1000, "Xử lý IPN giao dịch thành công", vnpayResponse);
        } else {
            vnpayResponse.put("RspCode", "97");
            vnpayResponse.put("Message", "Invalid Checksum");

            return createResponse(HttpStatus.BAD_REQUEST, 9001, "Sai chữ ký bảo mật Checksum", vnpayResponse);
        }
    }
}

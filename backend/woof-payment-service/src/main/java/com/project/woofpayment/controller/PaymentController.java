package com.project.woofpayment.controller;

import com.project.woofpayment.service.PaymentService;
import com.project.woofpayment.model.Payment;
import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import org.springframework.web.bind.annotation.CrossOrigin;

@RestController
@RequestMapping("/payment")
@CrossOrigin(origins = "*")
public class PaymentController {
    
    private final PaymentService paymentService;
    
    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }
    
    @GetMapping("/history")
    public List<Payment> getPaymentHistory(@RequestParam String UPIid) {
        return paymentService.getPaymentHistory(UPIid);
    }

    @PostMapping("/donate-money")
    public Payment donateMoney(@RequestBody Payment payment) {
        return paymentService.donateMoney(payment);
    }
    @PostMapping("/wallet/connect")
    public Payment connectWallet(@RequestParam String UPIid) {
        return paymentService.connectWallet(UPIid);
    }
    @GetMapping("/all-payments")
    public List<Payment> getAllPayments() {
        return paymentService.getAllPayments();
    }
    @GetMapping("/total-donations")
    public double getTotalDonations() {
        return paymentService.getTotalDonations();
    }
}
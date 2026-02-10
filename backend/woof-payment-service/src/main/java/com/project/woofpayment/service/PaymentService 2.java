package com.project.woofpayment.service;

import com.project.woofpayment.repository.PaymentRepository;
import com.project.woofpayment.model.Payment;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class PaymentService {
    PaymentRepository paymentRepository;
    private final com.project.woofpayment.repository.ExpenseRepository expenseRepository;

    public PaymentService(PaymentRepository paymentRepository, com.project.woofpayment.repository.ExpenseRepository expenseRepository) {
        this.paymentRepository = paymentRepository;
        this.expenseRepository = expenseRepository;
    }

    public Payment connectWallet(String UPIid) {
        Payment connection = Payment.builder()
                .transactionId("WALLET_" + System.currentTimeMillis())
                .upiId(UPIid)
                .amount(0.0) // Fix: double
                .currency("INR")
                .status("CONNECTED")
                .timestamp(java.time.LocalDateTime.now().toString())
                .build();
        return paymentRepository.save(connection);
    }

    public List<Payment> getPaymentHistory(String UPIid) {
        return paymentRepository.findAllByUpiId(UPIid);
    }   

    public double getTotalDonations() {
        return paymentRepository.findAll().stream()
                .mapToDouble(Payment::getAmount)
                .sum();
    }

    public List<Payment> getAllPayments() {
        return paymentRepository.findAll();
    }

    public void deleteWallet(String UPIid) {
        paymentRepository.deleteByUpiId(UPIid);
    }

    public void validateUPIid(String UPIid) {
        if(!paymentRepository.existsByUpiId(UPIid)) {
            throw new RuntimeException("UPI ID doesn't exist. Create a new UPI id");
        }
    }

    // Renamed to donateMoney to match Controller
    public Payment donateMoney(Payment payment) {
        // validateUPIid(payment.getUpiId()); // Removed to allow first time donations
        
        if (payment.getAmount() <= 0) {
           throw new RuntimeException("Amount must be greater than 0");
        }

        // Simple validation mock - checking if user has ever connected before isn't strict balance check
        // Assuming we are just recording a donation here.
        
        Payment newPayment = Payment.builder()
                .transactionId("PAYMENT_" + System.currentTimeMillis())
                .upiId(payment.getUpiId())
                .amount(payment.getAmount())
                .currency(payment.getCurrency())
                .status(payment.getStatus())
                .timestamp(java.time.LocalDateTime.now().toString())
                .build();   
        return paymentRepository.save(newPayment);
    }   


    // Expense Methods

    public com.project.woofpayment.model.Expense addExpense(com.project.woofpayment.model.Expense expense) {
        if (expense.getExpenseId() == null) {
            expense.setExpenseId("EXP_" + System.currentTimeMillis());
        }
        if (expense.getTimestamp() == null) {
            expense.setTimestamp(java.time.LocalDateTime.now().toString());
        }
        return expenseRepository.save(expense);
    }

    public double getTotalExpenses() {
        return expenseRepository.findAll().stream()
                .mapToDouble(com.project.woofpayment.model.Expense::getAmount)
                .sum();
    }

    public java.util.Map<String, Double> getExpenseBreakdown() {
        return expenseRepository.findAll().stream()
                .collect(java.util.stream.Collectors.groupingBy(
                        com.project.woofpayment.model.Expense::getCategory,
                        java.util.stream.Collectors.summingDouble(com.project.woofpayment.model.Expense::getAmount)
                ));
    }
    
    // For "Recent Transactions" in transparency, we return list of payments (donations) 
    // or we could return a mix. The controller asked for List<Payment>, so we'll just return recent payments.
    public List<Payment> getRecentTransactions() {
        // Just return all for now, or sort by timestamp if possible. 
        // Ideally we should use a custom query in repository to get top 10.
        // For simplicity, we'll return list reversed/sorted in memory or just all.
        List<Payment> all = paymentRepository.findAll();
        // naive sort for now
        // all.sort(java.util.Comparator.comparing(Payment::getTimestamp).reversed()); 
        return all; 
    }
}
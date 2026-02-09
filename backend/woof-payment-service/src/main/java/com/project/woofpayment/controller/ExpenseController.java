package com.project.woofpayment.controller;
import com.project.woofpayment.model.Expense;
import com.project.woofpayment.model.Payment;
import com.project.woofpayment.service.PaymentService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*")
@RequestMapping("/payment/analytics")
@RestController
public class ExpenseController {
    private final PaymentService paymentService;
    public ExpenseController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }
    @GetMapping("/total-expenses")
    public double getTotalExpenses() {
        return paymentService.getTotalExpenses();
    }   
    @GetMapping("/total-donations")
    public double getTotalDonations() {
        return paymentService.getTotalDonations();
    }
    @GetMapping("/expense-breakdown")   
    public Map<String, Double> getExpenseBreakdown() {
        return paymentService.getExpenseBreakdown();
    }
    @GetMapping("/recent-transactions")
    public List<Payment> getRecentTransactions() {
        return paymentService.getRecentTransactions();
    }
    @PostMapping("/add-expense")
    public Expense addExpense(@RequestBody Expense expense) {
        return paymentService.addExpense(expense);
    }  
}
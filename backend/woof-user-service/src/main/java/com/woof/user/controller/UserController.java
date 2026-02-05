package com.woof.user.controller;

import com.woof.user.model.User;
import com.woof.user.service.UserService;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/user")
@CrossOrigin(origins = "*") // Allow frontend access
public class UserController {
    
    private final UserService userService;
    
    public UserController(UserService userService) {
        this.userService = userService;
    }
    
    // Login or Register based on UPI ID - Matches API Spec
    @PostMapping("/login")
    public User login(@RequestBody User user) {
        return userService.loginOrRegister(user);
    }
    
    @GetMapping("/{upiId}")
    public User getUser(@PathVariable String upiId) {
        return userService.getUserByUpiId(upiId);
    }
}

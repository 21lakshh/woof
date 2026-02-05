package com.woof.user.service;

import com.woof.user.model.User;
import com.woof.user.repository.UserRepository;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class UserService {
    private final UserRepository userRepository;
    
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
    
    public User loginOrRegister(User userRequest) {
        // Simple auth: if UPI exists, return user; else create.
        // In a real app, you'd want password/OTP.
        Optional<User> existingUser = userRepository.findByUpiId(userRequest.getUpiId());
        
        if (existingUser.isPresent()) {
            return existingUser.get();
        } else {
            // Ensure ID is set if not provided (though UPI is likely ID)
            return userRepository.save(userRequest);
        }
    }
    
    public User getUserByUpiId(String upiId) {
        return userRepository.findByUpiId(upiId)
                .orElseThrow(() -> new RuntimeException("User not found with UPI ID: " + upiId));
    }
}
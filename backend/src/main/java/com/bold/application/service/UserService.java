package com.bold.application.service;

import org.springframework.stereotype.Service;

import com.bold.application.dto.LoginRequest;
import com.bold.application.entity.users.User;
import com.bold.application.repository.users.UserRepository;

@Service
public class UserService {

private final UserRepository userRepository;
    
    // BCryptエンコーダーの用意
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    // コンストラクタ注入
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public boolean login(LoginRequest request) {
        return userRepository.findByEmployeeCode(request.getEmployeeCode())
            .map(user -> {
                return passwordEncoder.matches(request.getPassword(), user.getPassword());
            })
            .orElse(false); 
    }
}
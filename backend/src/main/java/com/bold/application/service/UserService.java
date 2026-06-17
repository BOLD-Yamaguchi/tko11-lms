package com.bold.application.service;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
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

    public User login(LoginRequest request) {
        // ユーザーの存在チェック
        User user = userRepository.findByEmployeeCode(request.getEmployeeCode())
                .orElse(null);

        if (user == null) {
            return null;
        }

        // BCryptでのパスワード一致チェック（安全な比較）
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            return null;
        }

        return user;
    }
}
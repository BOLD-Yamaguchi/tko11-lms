package com.bold.application.controller.users;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

// 1. ハッシュ化用のクラスをインポート
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import com.bold.application.entity.users.User;
import com.bold.application.repository.users.UserRepository;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserRepository repository;

    // 2. エンコーダーのインスタンスを作成
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @GetMapping
    public List<User> getUsers() {
        return repository.findAll();
    }

    @PutMapping("/{employeeCode}")
    public User updateUser(@PathVariable String employeeCode, @RequestBody User updatedUser) {
        return repository.findById(UUID.fromString(employeeCode))
            .map(user -> {
                user.setUsername(updatedUser.getUsername());
                user.setMailAddress(updatedUser.getMailAddress());
                user.setAffiliationKbn(updatedUser.getAffiliationKbn());
                user.setAdminKbn(updatedUser.getAdminKbn());
                return repository.save(user);
            })
            .orElseThrow(() -> new RuntimeException("User not found with id " + employeeCode));
    }

    @PostMapping
    public User createUser(@RequestBody User newUser) {
        if (newUser.getUserId() == null) {
            newUser.setUserId(java.util.UUID.randomUUID());
        }
        
        if (newUser.getPassword() != null) {
            String hashedPassword = passwordEncoder.encode(newUser.getPassword());
            newUser.setPassword(hashedPassword);
        }

        java.time.LocalDateTime now = java.time.LocalDateTime.now();
        newUser.setCreatedAt(now);
        newUser.setUpdatedAt(now);
        return repository.save(newUser);
    }

    @PutMapping("/password-reset")
    public User resetPassword(@RequestBody User resetData) {
        return repository.findByMailAddress(resetData.getMailAddress())
            .map(user -> {
                String hashedPassword = passwordEncoder.encode(resetData.getPassword());
                user.setPassword(hashedPassword);
                
                return repository.save(user);
            })
            .orElseThrow(() -> new RuntimeException("該当するメールアドレスのユーザーが見つかりません: " + resetData.getMailAddress()));
    }
}
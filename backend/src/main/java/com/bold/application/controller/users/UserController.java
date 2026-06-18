package com.bold.application.controller.users;

import java.util.List;
import java.util.UUID;
import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import com.bold.application.entity.users.User;
import com.bold.application.repository.users.UserRepository;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserRepository repository;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @GetMapping
    public List<User> getUsers() {
        return repository.findAll();
    }

    @PutMapping("/{employeeCode}")
    public User updateUser(@PathVariable String employeeCode, @RequestBody User updatedUser) {
        repository.findByMailAddress(updatedUser.getMailAddress()).ifPresent(existingUser -> {
            String existingCode = existingUser.getEmployeeCode();
            if (existingCode == null || !existingCode.equals(employeeCode)) {
                throw new ResponseStatusException(HttpStatus.CONFLICT, "EMAIL_ALREADY_EXISTS");
            }
        });
        return repository.findByEmployeeCode(employeeCode)
                .map(user -> {
                    user.setUsername(updatedUser.getUsername());
                    user.setMailAddress(updatedUser.getMailAddress());
                    user.setAffiliationKbn(updatedUser.getAffiliationKbn());
                    user.setAdminKbn(updatedUser.getAdminKbn());
                    return repository.save(user);
                })
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "User not found with employeeCode " + employeeCode));
    }

    @PostMapping
    public User createUser(@RequestBody User newUser) {
        if (repository.findByMailAddress(newUser.getMailAddress()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "EMAIL_ALREADY_EXISTS");
        }

        if (newUser.getUserId() == null) {
            newUser.setUserId(UUID.randomUUID());
        }

        if (newUser.getPassword() != null) {
            String hashedPassword = passwordEncoder.encode(newUser.getPassword());
            newUser.setPassword(hashedPassword);
        }

        LocalDateTime now = LocalDateTime.now();
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
                .orElseThrow(() -> new RuntimeException("該当するメールアドレスが見つかりません: " + resetData.getMailAddress()));
    }

    @DeleteMapping("/{employeeCode}")
    @Transactional
    public void deleteUser(@PathVariable String employeeCode) {
        User user = repository.findByEmployeeCode(employeeCode)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "User not found with employeeCode " + employeeCode));

        repository.delete(user);
    }

}
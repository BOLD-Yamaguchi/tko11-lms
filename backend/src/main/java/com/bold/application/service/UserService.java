package com.bold.application.service;

import org.springframework.stereotype.Service;

import com.bold.application.dto.LoginRequest;
import com.bold.application.entity.users.User;
import com.bold.application.repository.users.UserRepository;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {

        this.userRepository = userRepository;
    }

    public boolean login(LoginRequest request) {

        User user =userRepository.findByEmployeeCode(request.getEmployeeCode()).orElse(null);

        if (user == null) {
            return false;
        }

        return user.getPassword().equals(request.getPassword());
    }
}
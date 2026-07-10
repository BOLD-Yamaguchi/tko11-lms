package com.bold.application.controller.users;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bold.application.dto.LoginRequest;
import com.bold.application.dto.LoginResponse;
import com.bold.application.entity.users.User;
import com.bold.application.service.UserService;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
public class LoginController {

    private final UserService userService;

    public LoginController(
            UserService userService) {
        this.userService = userService;
    }
    
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(
            @RequestBody LoginRequest request) {

        User user = userService.login(request);

        if (user != null) {

            return ResponseEntity.ok(
                    new LoginResponse(
                            true,
                            "ログイン成功",
                            user.getAdminKbn(),
                            user.getEmployeeCode(),
                            user.getUsername()));
        }

        return ResponseEntity.status(
                HttpStatus.UNAUTHORIZED)
                .body(
                        new LoginResponse(
                                false,
                                "社員コードまたはパスワードが違います",
                                null,null,null));
    }
}
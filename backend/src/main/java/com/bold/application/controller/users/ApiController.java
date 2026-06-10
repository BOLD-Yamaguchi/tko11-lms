package com.bold.application.controller.users;

import java.util.HashMap;
import java.util.Map;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
// Reactの開発サーバー（デフォルトは3000）からのアクセスを許可
//@CrossOrigin(origins = "http://localhost:3000") 
@CrossOrigin(origins = "http://localhost:5173") 
public class ApiController {

    @GetMapping("/api/data")
    public Map<String, String> getData() {
        Map<String, String> response = new HashMap<>();
        response.put("message", "EclipseのSpring Bootから届いたデータです！");
        return response;
    }
}
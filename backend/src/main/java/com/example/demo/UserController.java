package com.example.demo;

import java.util.List;

//Springが自動でオブジェクトを生成・注入するためのアノテーション
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
//HTTP GETリクエストを受け付けるアノテーション
import org.springframework.web.bind.annotation.GetMapping;
//URLの共通パスを設定するアノテーション
import org.springframework.web.bind.annotation.RequestMapping;
//このクラスをREST APIのコントローラとして扱うアノテーション
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/users")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    @Autowired
    private UserRepository repository;

    @GetMapping
    public List<User> getUsers() {
        return repository.findAll();
    }
}
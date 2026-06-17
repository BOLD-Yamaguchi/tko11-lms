package com.bold.application.controller.users;

import java.util.List;

//Springが自動でオブジェクトを生成・注入するためのアノテーション
import org.springframework.beans.factory.annotation.Autowired;
//HTTP GETリクエストを受け付けるアノテーション
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
//URLの共通パスを設定するアノテーション
import org.springframework.web.bind.annotation.RequestMapping;
//このクラスをREST APIのコントローラとして扱うアノテーション
import org.springframework.web.bind.annotation.RestController;

import com.bold.application.entity.users.User;
import com.bold.application.repository.users.UserRepository;
@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserRepository repository;

    @GetMapping
    public List<User> getUsers() {
        return repository.findAll();
    }

    @PutMapping("/{employeeCode}")
    public User updateUser(@PathVariable String employeeCode, @RequestBody User updatedUser) {
        // パスパラメーターのemployeeCodeを元に、現在のユーザー情報を取得
        return repository.findById(employeeCode)
            .map(user -> {
                // フロントから送られてきた内容で既存のデータを書き換える
                user.setUsername(updatedUser.getUsername());
                user.setMailAddress(updatedUser.getMailAddress());
                user.setAffiliationKbn(updatedUser.getAffiliationKbn());
                user.setAdminKbn(updatedUser.getAdminKbn());
                
                // データベースに保存して保存後のデータを返す
                return repository.save(user);
            })
            .orElseThrow(() -> new RuntimeException("User not found with id " + employeeCode));
    }
    @PostMapping
    public User createUser(@RequestBody User newUser) {
        // 必要に応じて、ここでサーバー側でUUIDなどを手動設定?
        if (newUser.getUserId() == null || newUser.getUserId().isEmpty()) {
            newUser.setUserId(java.util.UUID.randomUUID().toString());
        }
        java.time.LocalDateTime now = java.time.LocalDateTime.now();
        newUser.setCreatedAt(now);
        newUser.setUpdatedAt(now);
        // データベースに新しいユーザーを保存して返す
        return repository.save(newUser);
    }
    @PutMapping("/password-reset")
    public User resetPassword(@RequestBody User resetData) {
        
        // ステップ1で追加したメソッドを使い、メールアドレスでユーザーを検索
        return repository.findByMailAddress(resetData.getMailAddress())
            .map(user -> {
                // パスワードをフロントから送られてきた新しいものに書き換える
                user.setPassword(resetData.getPassword());
                
                // データベースに保存して返す
                return repository.save(user);
            })
            .orElseThrow(() -> new RuntimeException("該当するメールアドレスのユーザーが見つかりません: " + resetData.getMailAddress()));
    }
}
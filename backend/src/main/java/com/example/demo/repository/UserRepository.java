package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.entity.User;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
    // user_id（String）を主キーとして使用
    // Spring Data JPAが標準的なCRUD操作を自動的に提供します
}

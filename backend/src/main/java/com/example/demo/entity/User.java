package com.example.demo.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

@Entity
@Table(name = "users")
public class User {

    @Id
    @Column(name = "user_id", length = 50)
    private String userId;

    @Column(name = "username", length = 50)
    private String username;

    @Column(name = "mail_address", length = 50, nullable = false, unique = true)
    private String mailAddress;

    @Column(name = "password", length = 20)
    private String password;

    @Column(name = "employee_code", length = 20)
    private String employeeCode;

    @Column(name = "affiliation_kbn", columnDefinition = "integer default 0")
    private Integer affiliationKbn = 0; // 0: 東京, 1: 大阪

    @Column(name = "admin_kbn", columnDefinition = "integer default 0")
    private Integer adminKbn = 0; // 0: 一般ユーザー, 1: 管理者, 2: 貸出ユーザー

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    // コンストラクタ
    public User() {
    }

    public User(String userId, String mailAddress) {
        this.userId = userId;
        this.mailAddress = mailAddress;
    }

    // Getter/Setter
    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getMailAddress() {
        return mailAddress;
    }

    public void setMailAddress(String mailAddress) {
        this.mailAddress = mailAddress;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getEmployeeCode() {
        return employeeCode;
    }

    public void setEmployeeCode(String employeeCode) {
        this.employeeCode = employeeCode;
    }

    public Integer getAffiliationKbn() {
        return affiliationKbn;
    }

    public void setAffiliationKbn(Integer affiliationKbn) {
        this.affiliationKbn = affiliationKbn;
    }

    public Integer getAdminKbn() {
        return adminKbn;
    }

    public void setAdminKbn(Integer adminKbn) {
        this.adminKbn = adminKbn;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}

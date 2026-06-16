package com.bold.application.entity.users;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Column;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
public class User {

    @Id
    @Column(name = "user_id")
    private String userId; // UUIDが入る（新規登録時は自動、またはJava側で生成）

    private String username;
    
    @Column(name = "mail_address")
    private String mailAddress;
    
    private String password;
    
    @Column(name = "employee_code")
    private String employeeCode;
    
    @Column(name = "affiliation_kbn")
    private Integer affiliationKbn; // 拠点（東京0, 大阪1）
    
    @Column(name = "admin_kbn")
    private Integer adminKbn; // 権限（一般0, 貸出1, 管理2）

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // --- 以下、すべてのゲッターとセッター ---
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getMailAddress() { return mailAddress; }
    public void setMailAddress(String mailAddress) { this.mailAddress = mailAddress; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getEmployeeCode() { return employeeCode; }
    public void setEmployeeCode(String employeeCode) { this.employeeCode = employeeCode; }

    public Integer getAffiliationKbn() { return affiliationKbn; }
    public void setAffiliationKbn(Integer affiliationKbn) { this.affiliationKbn = affiliationKbn; }

    public Integer getAdminKbn() { return adminKbn; }
    public void setAdminKbn(Integer adminKbn) { this.adminKbn = adminKbn; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
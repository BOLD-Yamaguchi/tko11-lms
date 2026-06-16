package com.bold.application.entity.users;

import java.time.LocalDateTime;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "users")
public class User {

@Id
@Column(name = "user_id")
private UUID userId;

@Column(name = "username", nullable = false)
private String username;

@Column(name = "mail_address", nullable = false, unique = true)
private String mailAddress;

@Column(name = "password", nullable = false)
private String password;

@Column(name = "employee_code", nullable = false, unique = true)
private String employeeCode;

@Column(name = "affiliation_kbn", nullable = false)
private Integer affiliationKbn;

@Column(name = "admin_kbn", nullable = false)
private Integer adminKbn;

@Column(name = "created_at", nullable = false)
private LocalDateTime createdAt;

@Column(name = "updated_at", nullable = false)
private LocalDateTime updatedAt;

public UUID getUserId() {
    return userId;
}

public void setUserId(UUID userId) {
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
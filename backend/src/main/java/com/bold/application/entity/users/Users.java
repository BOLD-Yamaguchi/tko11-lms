package com.bold.application.entity.users;

import java.time.LocalDateTime;
import java.util.UUID;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "users")
public class Users {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID user_id;

    private String username;
    
    private String mail_address;
    
    private String password;
    
    private String employee_code;
    
    private Long affiliation_kbn;
    
    private Long admin_kbn;
	
    private LocalDateTime created_at;
	
    private LocalDateTime updated_at;

	public UUID getUser_id() {
		return user_id;
	}

	public void setUser_id(UUID user_id) {
		this.user_id = user_id;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getMail_address() {
		return mail_address;
	}

	public void setMail_address(String mail_address) {
		this.mail_address = mail_address;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getEmployee_code() {
		return employee_code;
	}

	public void setEmployee_code(String employee_code) {
		this.employee_code = employee_code;
	}

	public Long getAffiliation_kbn() {
		return affiliation_kbn;
	}

	public void setAffiliation_kbn(Long affiliation_kbn) {
		this.affiliation_kbn = affiliation_kbn;
	}

	public Long getAdmin_kbn() {
		return admin_kbn;
	}

	public void setAdmin_kbn(Long admin_kbn) {
		this.admin_kbn = admin_kbn;
	}

	public LocalDateTime getCreated_at() {
		return created_at;
	}

	public void setCreated_at(LocalDateTime created_at) {
		this.created_at = created_at;
	}

	public LocalDateTime getUpdated_at() {
		return updated_at;
	}

	public void setUpdated_at(LocalDateTime updated_at) {
		this.updated_at = updated_at;
	}

}

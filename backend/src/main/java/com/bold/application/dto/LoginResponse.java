package com.bold.application.dto;

public class LoginResponse {

    private boolean success;
    private String message;
    private Integer adminKbn;
    private String employeeCode;
    private String username;
    private String userId;

    public LoginResponse() {
    }

    public LoginResponse(
            boolean success,
            String message,
            Integer adminKbn,
            String employeeCode,
            String username,
            String userId) {

        this.success = success;
        this.message = message;
        this.adminKbn = adminKbn;
        this.employeeCode = employeeCode;
        this.username = username;
        this.userId = userId;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
    
    public Integer getAdminKbn() {
		return adminKbn;
	}
    
    public void setAdminKbn(Integer adminKbn) {
		this.adminKbn = adminKbn;
	}
    
    public String getEmployeeCode() {
        return employeeCode;
    }

    public void setEmployeeCode(String employeeCode) {
        this.employeeCode = employeeCode;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }
    public String getUserId() {
        return userId;
    }
}
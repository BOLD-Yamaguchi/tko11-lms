package com.bold.application.entity.users;

import java.time.LocalDateTime;
import java.util.UUID;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "trn_status")

public class Trn_Status {

	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    private Long book_id;

	private UUID lend_user_id;

	private String lend_status;

    private LocalDateTime rtndated_at;

	private LocalDateTime created_at;
	
    private LocalDateTime updated_at;

	public Long getBook_id() {
		return book_id;
	}

	public void setBook_id(Long book_id) {
		this.book_id = book_id;
	}

	public UUID getLend_user_id() {
		return lend_user_id;
	}

	public void setLend_user_id(UUID lend_user_id) {
		this.lend_user_id = lend_user_id;
	}

	public String getLend_status() {
		return lend_status;
	}

	public void setLend_status(String lend_status) {
		this.lend_status = lend_status;
	}

	public LocalDateTime getRtndated_at() {
		return rtndated_at;
	}

	public void setRtndated_at(LocalDateTime rtndated_at) {
		this.rtndated_at = rtndated_at;
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

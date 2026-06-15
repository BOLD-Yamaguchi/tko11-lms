package com.bold.application.entity.users;

import java.time.LocalDateTime;
import java.util.UUID;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.Table;

@Entity
@Table(name = "mst_book_log")
@IdClass(Mst_Book_LogId.class)

public class Mst_Book_Log {

    @Id
	private Long lend_id;

    @Id
	private Long book_id;

	private UUID lend_user_id;

    private LocalDateTime created_at;
	
    private LocalDateTime updated_at;

    private String statement;

    private String hidden_flg;

	public Long getLend_id() {
		return lend_id;
	}

	public void setLend_id(Long lend_id) {
		this.lend_id = lend_id;
	}

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

	public String getStatement() {
		return statement;
	}

	public void setStatement(String statement) {
		this.statement = statement;
	}

	public String getHidden_flg() {
		return hidden_flg;
	}

	public void setHidden_flg(String hidden_flg) {
		this.hidden_flg = hidden_flg;
	}
}

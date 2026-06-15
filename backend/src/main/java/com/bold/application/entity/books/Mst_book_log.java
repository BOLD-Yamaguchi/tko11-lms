package com.bold.application.entity.books;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "mst_book_log")
public class Mst_book_log {

	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int lend_id;
    private int book_id;
    private String lend_user_id;
    private LocalDateTime created_at;
    private LocalDateTime updated_at;
    private String statement;
    private int hidden_flg;

    public int getLend_Id() {
        return lend_id;
    }

	public void setLend_Id(int lend_id) {
		this.lend_id = lend_id;
	}

    public int getBook_Id() {
        return book_id;
    }

	public void setBook_Id(int book_id) {
		this.book_id = book_id;
	}

    public String getLend_user_id() {
        return lend_user_id;
    }

    public void setLend_user_id(String lend_user_id) {
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

    public int getHidden_flg() {
        return hidden_flg;
    }

    public void setHidden_flg(int hidden_flg) {
        this.hidden_flg = hidden_flg;
    }
}

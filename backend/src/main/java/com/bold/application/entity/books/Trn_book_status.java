package com.bold.application.entity.books;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "trn_book_status")
public class Trn_book_status {

	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int book_id;
    private String lend_user_id;
    private String lend_status;
    private LocalDateTime returned_at;
    private LocalDateTime created_at;
    private LocalDateTime updated_at;

    public int getBook_Id() {
        return book_id;
    }

	public void setBook_Id(int book_id) {
		this.book_id = book_id;
	}

	public String getLend_status() {
        return lend_status;
    }

    public void setLend_status(String lend_status) {
        this.lend_status = lend_status;
    }

    public String getLend_user_id() {
        return lend_user_id;
    }

    public void setLend_user_id(String lend_user_id) {
        this.lend_user_id = lend_user_id;
    }

    public LocalDateTime getReturned_at() {
        return returned_at;
    }

    public void setReturned_at(LocalDateTime returned_at) {
        this.returned_at = returned_at;
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

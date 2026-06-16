package com.bold.application.entity.books;

import java.time.LocalDateTime;
import java.util.UUID;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "trn_book_status")
public class TrnBookStatus {

	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int bookId;
    private UUID lendUserId;
    private String lendStatus;
    private LocalDateTime returnedAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public int getBookId() {
        return bookId;
    }

	public void setBookId(int bookId) {
		this.bookId = bookId;
	}

    public String getLendUserId() {
        return lendUserId;
    }

    public void setLendUserId(String lendUserId) {
        this.lendUserId = lendUserId;
    }

	public String getLendStatus() {
        return lendStatus;
    }

    public void setLendStatus(String lendStatus) {
        this.lendStatus = lendStatus;
    }

    public LocalDateTime getReturnedAt() {
        return returnedAt;
    }

    public void setReturnedAt(LocalDateTime returnedAt) {
        this.returnedAt = returnedAt;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreated_at(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}

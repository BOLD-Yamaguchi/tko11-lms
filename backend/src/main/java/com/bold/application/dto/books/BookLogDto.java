package com.bold.application.dto.books;

import java.time.LocalDateTime;
import java.util.UUID;

public class BookLogDto {
	private int lendId;
	private int bookId;
	private UUID lendUserId;
	private String review;
	private String hiddenFlg;
	private LocalDateTime createdAt;
	private LocalDateTime updatedAt;
	private String title;
	private String author;
	private String borrower;

	public int getLendId() {
		return lendId;
	}

	public void setLendId(int lendId) {
		this.lendId = lendId;
	}

	public int getBookId() {
		return bookId;
	}

	public void setBookId(int bookId) {
		this.bookId = bookId;
	}

	public UUID getLendUserId() {
		return lendUserId;
	}

	public void setLendUserId(UUID lendUserId) {
		this.lendUserId = lendUserId;
	}

	public String getReview() {
		return review;
	}

	public void setReview(String review) {
		this.review = review;
	}

	public String getHiddenFlg() {
		return hiddenFlg;
	}

	public void setHiddenFlg(String hiddenFlg) {
		this.hiddenFlg = hiddenFlg;
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

	// Getter/Setter を追加
	public String getBorrower() {
		return borrower;
	}

	public void setBorrower(String borrower) {
		this.borrower = borrower;
	}	
	
	public void setUpdatedAt(LocalDateTime updatedAt) {
		this.updatedAt = updatedAt;
	}
	// Getter/Setter の追記
	public String getTitle() { return title; }
	public void setTitle(String title) { this.title = title; }

	public String getAuthor() { return author; }
	public void setAuthor(String author) { this.author = author; }
}
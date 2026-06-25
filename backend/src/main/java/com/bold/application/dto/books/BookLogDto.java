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

	public void setUpdatedAt(LocalDateTime updatedAt) {
		this.updatedAt = updatedAt;
	}
}
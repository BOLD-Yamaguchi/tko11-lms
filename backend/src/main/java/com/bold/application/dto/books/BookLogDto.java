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

	// --- 【今回追加するフィールド】 ---
	private String status;
	private LocalDateTime reservationAt;
	// ----------------------------------

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

	public String getBorrower() {
		return borrower;
	}

	public void setBorrower(String borrower) {
		this.borrower = borrower;
	}	
	
	public String getTitle() { 
		return title; 
	}
	
	public void setTitle(String title) { 
		this.title = title; 
	}

	public String getAuthor() { 
		return author; 
	}
	
	public void setAuthor(String author) { 
		this.author = author; 
	}

	// --- 【今回追加する Getter / Setter】 ---
	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public LocalDateTime getReservationAt() {
		return reservationAt;
	}

	public void setReservationAt(LocalDateTime reservationAt) {
		this.reservationAt = reservationAt;
	}
	// -----------------------------------------
}
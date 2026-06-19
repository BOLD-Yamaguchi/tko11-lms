package com.bold.application.entity.books;

import java.time.LocalDateTime;
import java.util.UUID;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "mst_book_log")
public class MstBookLog {

	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int lendId;
    @NotNull
	private int bookId;
    @NotNull
    private UUID lendUserId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    @Colum(length=500)
    private String review;
	@NotBlank
    @Colum(length=1)
    private String hiddenFlg;

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
}

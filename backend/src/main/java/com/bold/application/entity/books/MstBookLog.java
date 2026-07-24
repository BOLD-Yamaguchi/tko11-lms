package com.bold.application.entity.books;

import java.time.LocalDateTime;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

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

    @Column(length = 500)
    private String review;

	@NotBlank
    @Column(nullable = false, length = 1)
    private String hiddenFlg;

    // --- 【今回の追加項目】 ---
    @Column(length = 20)
    private String status; // ステータス（例: "貸出中", "返却済み", "予約中" など）

    private LocalDateTime reservationAt; // 予約日（※日時まで管理する場合は LocalDateTime にしてください）
    // -------------------------

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

    // --- 【今回の追加項目のGetter / Setter】 ---
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
    // ------------------------------------------
}
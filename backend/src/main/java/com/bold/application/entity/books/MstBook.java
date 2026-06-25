package com.bold.application.entity.books;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;

@Entity
@Table(name = "mst_book")
public class MstBook {

	@Id
	@GeneratedValue(
			strategy = GenerationType.SEQUENCE,
			generator = "book_seq"
	)
	@SequenceGenerator(
			name = "book_seq",
			sequenceName = "book_seq",
			initialValue = 100001,
			allocationSize = 1)
	private int bookId;

	@NotBlank
	@Column(nullable = false, length = 100)
	private String bookName;

	@Column(length = 15)
	private String isbn;

	@NotBlank
	@Column(nullable = false, length = 100)
	private String authorName;

	@NotBlank
	@Column(nullable = false, length = 1)
	private String bookStatus;

	@NotBlank
	@Column(nullable = false, length = 40)
	private String publisher;

	private LocalDate publishedAt;

	@Column(length = 100)
	private String memo;

	@NotBlank
	@Column(nullable = false)
	private int categoryLevel1Id;
	private int categoryLevel2Id;

	@NotBlank
	@Column(nullable = false, length = 1)
	private String region;

	@Column(length = 20)
	private String shelfNo;

	private int tierNo;
	private LocalDateTime createdAt;
	private LocalDateTime bookInfoUpdatedAt;
	private UUID lendUserId;

	@NotBlank
	@Column(nullable = false, length = 1)
	private String status;

	private LocalDate returnedAt;
	private LocalDateTime statusUpdatedAt;

	public int getBookId() {
		return bookId;
	}

	public void setBookId(int bookId) {
		this.bookId = bookId;
	}

	public String getBookName() {
		return bookName;
	}

	public void setBookName(String bookName) {
		this.bookName = bookName;
	}

	public String getIsbn() {
		return isbn;
	}

	public void setIsbn(String isbn) {
		this.isbn = isbn;
	}

	public String getAuthorName() {
		return authorName;
	}

	public void setAuthorName(String authorName) {
		this.authorName = authorName;
	}

	public String getBookStatus() {
		return bookStatus;
	}

	public void setBookStatus(String bookStatus) {
		this.bookStatus = bookStatus;
	}

	public String getPublisher() {
		return publisher;
	}

	public void setPublisher(String publisher) {
		this.publisher = publisher;
	}

	public LocalDate getPublishedAt() {
		return publishedAt;
	}

	public void setPublishedAt(LocalDate publishedAt) {
		this.publishedAt = publishedAt;
	}

	public String getMemo() {
		return memo;
	}

	public void setMemo(String memo) {
		this.memo = memo;
	}

	public int getCategoryLevel1Id() {
		return categoryLevel1Id;
	}

	public void setCategoryLevel1Id(int categoryLevel1Id) {
		this.categoryLevel1Id = categoryLevel1Id;
	}

	public int getCategoryLevel2Id() {
		return categoryLevel2Id;
	}

	public void setCategoryLevel2Id(int categoryLevel2Id) {
		this.categoryLevel2Id = categoryLevel2Id;
	}

	public String getRegion() {
		return region;
	}

	public void setRegion(String region) {
		this.region = region;
	}

	public String getShelfNo() {
		return shelfNo;
	}

	public void setShelfNo(String shelfNo) {
		this.shelfNo = shelfNo;
	}

	public int getTierNo() {
		return tierNo;
	}

	public void setTierNo(int tierNo) {
		this.tierNo = tierNo;
	}

	public LocalDateTime getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(LocalDateTime createdAt) {
		this.createdAt = createdAt;
	}

	public LocalDateTime getBookInfoUpdatedAt() {
		return bookInfoUpdatedAt;
	}

	public void setBookInfoUpdatedAt(LocalDateTime bookInfoUpdatedAt) {
		this.bookInfoUpdatedAt = bookInfoUpdatedAt;
	}

	public LocalDateTime getUpdatedAt() {
		return bookInfoUpdatedAt;
	}

	public void setUpdatedAt(LocalDateTime updatedAt) {
		this.bookInfoUpdatedAt = updatedAt;
	}

	public UUID getLendUserId() {
		return lendUserId;
	}

	public void setLendUserId(UUID userId) {
		this.lendUserId = userId;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public LocalDate getReturnedAt() {
		return returnedAt;
	}

	public void setReturnedAt(LocalDate returnedAt) {
		this.returnedAt = returnedAt;
	}

	public LocalDateTime getStatusUpdatedAt() {
		return statusUpdatedAt;
	}

	public void setStatusUpdatedAt(LocalDateTime updatedAt) {
		this.statusUpdatedAt = updatedAt;
	}
}

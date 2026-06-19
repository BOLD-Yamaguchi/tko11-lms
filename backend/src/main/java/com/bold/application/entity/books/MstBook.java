package com.bold.application.entity.books;

import java.time.LocalDate;
import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

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
			allocotionStyle = 1)
	private int bookId;
	@NotBlank
	@Colum(length=100)
	private String bookName;
	@Colum(length=15)
	private String isbn;
	@NotBlank
	@Colum(length=100)
	private String authorName;
	@NotBlank
	@Colum(length=1)
	private String bookStatus;
	@NotBlank
	@COLUM(length=40)
	private String publisher;
	private LocalDate publishedAt;
	@Colum(length=100)
	private String memo;
	private int categoryLevel1Id;
	private int categoryLevel2Id;
	@NotBlank
	@Colum(length=1)
	private String region;
	@NotBlank
	@Colum(length=20)
	private String shelfNo;
	private ing tierNo;
	private LocalDateTime createdAt;
	private LocalDateTime bookInfoUpdatedAt;
	private UUID lendUserId;
	@NotBlank
	@Colum(length=1)
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

	public String getAutherName() {
		return authorName;
	}

	public void setAutherName(String autherName) {
		this.authorName = autherName;
	}

	public String getBookStatus() {
		return bookStatus;
	}

	public void setBookStatus(String bookStatus) {
		this.BookStatus = bookStatus;
	}

	public String getPublisher() {
		return publisher;
	}

	public void setPublisher(String publisher) {
		this.publisher = publisher;
	}

	public LocalDate getPublished_at() {
		return publishedAt;
	}

	public void setPublished_at(LocalDate publishedAt) {
		this.publishedAt = publishedAt;
	}

	public String getMemo() {
		return memo;
	}

	public void setMemo(String memo) {
		this.memo = memo;
	}

	public int getCategoryLevel1() {
		return categoryLevel1Id;
	}

	public void setCategoryLevel1(int categoryLevel1) {
		this.categoryLevel1Id = categoryLevel1;
	}

	public int getCategoryLevel2() {
		return categoryLevel2Id;
	}

	public void setCategoryLevel2(int categoryLevel2) {
		this.categoryLevel2Id = categoryLevel2;
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

	public void setUpdatedAt(LocalDateTime updatedAt) {
		this.updatedAt = updatedAt;
	}

	public String getLendUserId() {
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

package com.bold.application.dto.books;

import java.time.LocalDate;

import org.springframework.format.annotation.DateTimeFormat;

public class BookSearchRequest {

	private Integer bookId;
	private String bookName;
	private String authorName;
	private String publisher;
	@DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
	private LocalDate publishedAtStart;
	@DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
	private LocalDate publishedAtEnd;
	private Integer categoryLevel1;
	private Integer categoryLevel2;
	private String status;
	private String bookStatus;
	private String region;

	public Integer getBookId() {
		return bookId;
	}

	public void setBookId(Integer bookId) {
		this.bookId = bookId;
	}

	public String getBookName() {
		return bookName;
	}

	public void setBookName(String bookName) {
		this.bookName = bookName;
	}

	public String getAuthorName() {
		return authorName;
	}

	public void setAuthorName(String authorName) {
		this.authorName = authorName;
	}

	public String getPublisher() {
		return publisher;
	}

	public void setPublisher(String publisher) {
		this.publisher = publisher;
	}

	public LocalDate getPublishedAtStart() {
		return publishedAtStart;
	}

	public void setPublishedAtStart(LocalDate publishedAtStart) {
		this.publishedAtStart = publishedAtStart;
	}

	public LocalDate getPublishedAtEnd() {
		return publishedAtEnd;
	}

	public void setPublishedAtEnd(LocalDate publishedAtEnd) {
		this.publishedAtEnd = publishedAtEnd;
	}

	public Integer getCategoryLevel1() {
		return categoryLevel1;
	}

	public void setCategoryLevel1(Integer categoryLevel1) {
		this.categoryLevel1 = categoryLevel1;
	}

	public Integer getCategoryLevel2() {
		return categoryLevel2;
	}

	public void setCategoryLevel2(Integer categoryLevel2) {
		this.categoryLevel2 = categoryLevel2;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public String getBookStatus() {
		return bookStatus;
	}

	public void setBookStatus(String bookStatus) {
		this.bookStatus = bookStatus;
	}

	public String getRegion() {
		return region;
	}

	public void setRegion(String region) {
		this.region = region;
	}
}

package com.bold.application.entity.users;

import java.time.LocalDate;
import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "mst_book")

public class Mst_Book {

	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long book_id;

    private String book_name;

    private String isbn;
	
    private String author_name;
	
    private Long lend_status;
	
    private String publisher;

    private LocalDate published_at;
	
    private String memo;
	
    private Long category_lavel1;

    private Long category_lavel2;
	
    private Long region;

    private String shelf_no;
	
    private Long tier_no;
	
    private LocalDateTime created_at;
	
    private LocalDateTime updated_at;

	public Long getBook_id() {
		return book_id;
	}

	public void setBook_id(Long book_id) {
		this.book_id = book_id;
	}

	public String getBook_name() {
		return book_name;
	}

	public void setBook_name(String book_name) {
		this.book_name = book_name;
	}

	public String getIsbn() {
		return isbn;
	}

	public void setIsbn(String isbn) {
		this.isbn = isbn;
	}

	public String getAuthor_name() {
		return author_name;
	}

	public void setAuthor_name(String author_name) {
		this.author_name = author_name;
	}

	public Long getLend_status() {
		return lend_status;
	}

	public void setLend_status(Long lend_status) {
		this.lend_status = lend_status;
	}

	public String getPublisher() {
		return publisher;
	}

	public void setPublisher(String publisher) {
		this.publisher = publisher;
	}

	public LocalDate getPublished_at() {
		return published_at;
	}

	public void setPublished_at(LocalDate published_at) {
		this.published_at = published_at;
	}

	public String getMemo() {
		return memo;
	}

	public void setMemo(String memo) {
		this.memo = memo;
	}

	public Long getCategory_lavel1() {
		return category_lavel1;
	}

	public void setCategory_lavel1(Long category_lavel1) {
		this.category_lavel1 = category_lavel1;
	}

	public Long getCategory_lavel2() {
		return category_lavel2;
	}

	public void setCategory_lavel2(Long category_lavel2) {
		this.category_lavel2 = category_lavel2;
	}

	public Long getRegion() {
		return region;
	}

	public void setRegion(Long region) {
		this.region = region;
	}

	public String getShelf_no() {
		return shelf_no;
	}

	public void setShelf_no(String shelf_no) {
		this.shelf_no = shelf_no;
	}

	public Long getTier_no() {
		return tier_no;
	}

	public void setTier_no(Long tier_no) {
		this.tier_no = tier_no;
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

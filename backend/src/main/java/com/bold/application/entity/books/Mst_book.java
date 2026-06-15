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
public class Mst_book {

	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int book_id;
    private String book_name;
    private String isbn;
    private String auther_name;
    private String lend_status;
    private String publisher;
    private LocalDate published_at;
    private String memo;
    private int category_level1;
    private int category_level2;
    private String region;
    private String shelf_no;
    private String tier_no;
    private LocalDateTime created_at;
    private LocalDateTime updated_at;

    public int getBook_Id() {
        return book_id;
    }

	public void setBook_Id(int book_id) {
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

    public String getAuther_name() {
        return auther_name;
    }

    public void setAuther_name(String auther_name) {
        this.auther_name = auther_name;
    }

    public String getLend_status() {
        return lend_status;
    }

    public void setLend_status(String lend_status) {
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

    public int getCategory_level1() {
        return category_level1;
    }

    public void setCategory_level1(int category_level1) {
        this.category_level1 = category_level1;
    }

    public int getCategory_level2() {
        return category_level2;
    }

    public void setCategory_level2(int category_level2) {
        this.category_level2 = category_level2;
    }

    public String getRegion() {
        return region;
    }

    public void setRegion(String region) {
        this.region = region;
    }

    public String getShelf_no() {
        return shelf_no;
    }

    public void setShelf_no(String shelf_no) {
        this.shelf_no = shelf_no;
    }

    public String getTier_no() {
        return tier_no;
    }

    public void setTier_no(String tier_no) {
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

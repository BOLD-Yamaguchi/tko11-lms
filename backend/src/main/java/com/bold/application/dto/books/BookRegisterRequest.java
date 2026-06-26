package com.bold.application.dto.books;

import java.time.LocalDate;

import jakarta.validation.constraints.NotBlank;

public class BookRegisterRequest {
    @NotBlank(message = "書籍名は必須です")
    private String title;
    private String isbn;
    @NotBlank(message = "著者名は必須です")
    private String author;
    @NotBlank(message = "出版社は必須です")
    private String publisher;
    private LocalDate publishedAt;
    @NotBlank(message = "大分類は必須です")
    private String majorCategory;
    private String minorCategory;
    private String collectionStatus;
    private String location;
    @NotBlank(message = "棚番号は必須です")
    private String shelfNumber;
    private String tierNumber;
    private String notes;

    // 既存構造対応用のネスト対策
    private BookRegisterRequest book;

    // ゲッター・セッター
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getIsbn() { return isbn; }
    public void setIsbn(String isbn) { this.isbn = isbn; }
    public String getAuthor() { return author; }
    public void setAuthor(String author) { this.author = author; }
    public String getPublisher() { return publisher; }
    public void setPublisher(String publisher) { this.publisher = publisher; }
    public LocalDate getPublishedAt() { return publishedAt; }
    public void setPublishedAt(LocalDate publishedAt) { this.publishedAt = publishedAt; }
    public String getMajorCategory() { return majorCategory; }
    public void setMajorCategory(String majorCategory) { this.majorCategory = majorCategory; }
    public String getMinorCategory() { return minorCategory; }
    public void setMinorCategory(String minorCategory) { this.minorCategory = minorCategory; }
    public String getCollectionStatus() { return collectionStatus; }
    public void setCollectionStatus(String collectionStatus) { this.collectionStatus = collectionStatus; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    public String getShelfNumber() { return shelfNumber; }
    public void setShelfNumber(String shelfNumber) { this.shelfNumber = shelfNumber; }
    public String getTierNumber() { return tierNumber; }
    public void setTierNumber(String tierNumber) { this.tierNumber = tierNumber; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    public BookRegisterRequest getBook() { return book; }
    public void setBook(BookRegisterRequest book) { this.book = book; }
}
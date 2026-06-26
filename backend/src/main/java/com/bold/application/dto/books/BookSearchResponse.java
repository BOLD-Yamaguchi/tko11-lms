package com.bold.application.dto.books;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.bold.application.entity.books.MstBook;

public record BookSearchResponse(
    int bookId,
    String bookName,
    String isbn,
    String authorName,
    String status,
    String bookStatus,
    String publisher,
    LocalDate publishedAt,
    String memo,
    int categoryLevel1,
    Integer categoryLevel2,
    String region,
    String shelfNo,
    int tierNo,
    LocalDateTime createdAt,
    LocalDateTime updatedAt) {

  public static BookSearchResponse from(MstBook mstBook) {
    return new BookSearchResponse(
        mstBook.getBookId(),
        mstBook.getBookName(),
        mstBook.getIsbn(),
        mstBook.getAuthorName(),
        mstBook.getStatus(),
        mstBook.getBookStatus(),
        mstBook.getPublisher(),
        mstBook.getPublishedAt(),
        mstBook.getMemo(),
        mstBook.getCategoryLevel1Id(),
        mstBook.getCategoryLevel2Id(),
        mstBook.getRegion(),
        mstBook.getShelfNo(),
        mstBook.getTierNo(),
        mstBook.getCreatedAt(),
        mstBook.getUpdatedAt());
  }
}

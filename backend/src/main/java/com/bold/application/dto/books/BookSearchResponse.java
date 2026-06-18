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
		String lendStatus,
		String publisher,
		LocalDate publishedAt,
		String memo,
		int categoryLevel1,
		int categoryLevel2,
		String region,
		String shelfNo,
		String tierNo,
		LocalDateTime createdAt,
		LocalDateTime updatedAt) {

	public static BookSearchResponse from(MstBook mstBook) {
		return from(mstBook, null);
	}

	public static BookSearchResponse from(MstBook mstBook, String lendStatus) {
		return new BookSearchResponse(
				mstBook.getBookId(),
				mstBook.getBookName(),
				mstBook.getIsbn(),
				mstBook.getAutherName(),
				mstBook.getStatus(),
				lendStatus,
				mstBook.getPublisher(),
				mstBook.getPublished_at(),
				mstBook.getMemo(),
				mstBook.getCategoryLevel1(),
				mstBook.getCategoryLevel2(),
				mstBook.getRegion(),
				mstBook.getShelfNo(),
				mstBook.getTierNo(),
				mstBook.getCreatedAt(),
				mstBook.getUpdatedAt());
	}
}

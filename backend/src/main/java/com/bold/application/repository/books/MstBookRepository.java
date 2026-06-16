package com.bold.application.repository.books;

import java.time.LocalDate;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import src.main.java.com.bold.application.entity.books.MstBook;

@Repository
public interface BookRepository extends JpaRepository<MstBook, Long> {
	
	List<MstBook> search(String bookName,
			String authorName,
			String publisher,
			LocalDate publishedAtStart,
			LocalDate publishedAtEnd,
			String lendStatus,
			int categoryLevel1,
			int categoryLevel2
			);
	List<MstBook> findByLendStatus(String lendStatus);
	MstBook findByBookId(String bookId);

	void insertMstBook(MstBook mstBook);
}

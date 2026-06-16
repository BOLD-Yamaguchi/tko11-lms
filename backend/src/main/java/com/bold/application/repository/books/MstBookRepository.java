package com.bold.application.repository.books;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.bold.application.entity.books.MstBook;

@Repository
public interface MstBookRepository extends JpaRepository<MstBook, Integer> {
	
	List<MstBook> search(String bookId,
			String bookName,
			String isbn,
			String authorName,
			String status,
			String publisher,
			LocalDate publishedAtStart,
			LocalDate publishedAtEnd,
			int categoryLevel1,
			int categoryLevel2,
			String rigion,
			String shelfNo,
			int tierNo
			);

	MstBook findByBookId(String bookId);

	void setMstBook(MstBook mstBook, String bookId);

	void insertMstBook(MstBook mstBook);

}

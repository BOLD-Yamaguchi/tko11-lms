package com.bold.application.repository.books;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.bold.application.entity.books.MstBook;

@Repository
public interface MstBookRepository extends JpaRepository<MstBook, Integer> {

	// 一覧取得
	List<MstBook> findAll();

	// 条件付き一覧取得
	List<MstBook> search(int bookId,
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

	// 書籍情報取得（１件）
	MstBook findByBookId(int bookId);

	// 登録・更新
	MstBook save(MstBook mstBook, int bookId);

}

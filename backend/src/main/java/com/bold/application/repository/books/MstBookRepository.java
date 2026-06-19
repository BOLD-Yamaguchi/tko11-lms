package com.bold.application.repository.books;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.bold.application.entity.books.MstBook;

@Repository
public interface MstBookRepository extends JpaRepository<MstBook, Integer> {

	// 一覧取得
	List<MstBook> findAll();

	// ステータスから一覧取得
	List<MstBook> findByStatus(String status);

	// 書籍情報取得（１件）
	MstBook findByBookId(int bookId);

	// 書籍検索API
	//Nullか空値の場合は、検索条件をTrueとする
	@Query("""
			SELECT b
			FROM MstBook b
			LEFT JOIN TrnBookStatus t ON b.bookId = t.bookId
			WHERE (:bookId IS NULL OR b.bookId = :bookId)
			AND (:bookName IS NULL OR :bookName = '' OR b.bookName LIKE CONCAT('%', :bookName, '%'))
			AND (:authorName IS NULL OR :authorName = '' OR b.authorName LIKE CONCAT('%', :authorName, '%'))
			AND (:publisher IS NULL OR :publisher = '' OR b.publisher LIKE CONCAT('%', :publisher, '%'))
			AND (:publishedAtStart IS NULL OR b.publishedAt >= :publishedAtStart)
			AND (:publishedAtEnd IS NULL OR b.publishedAt <= :publishedAtEnd)
			AND (:categoryLevel1 IS NULL OR b.categoryLevel1Id = :categoryLevel1)
			AND (:categoryLevel2 IS NULL OR b.categoryLevel2Id = :categoryLevel2)
			AND (:status IS NULL OR :status = '' OR t.status LIKE CONCAT('%', :status, '%'))
			AND (:bookStatus IS NULL OR :bookStatus = '' OR b.status = :bookStatus)
			AND (:region IS NULL OR :region = '' OR b.region = :region)
			""")
	List<MstBook> search(
			@Param("bookId") Integer bookId,
			@Param("bookName") String bookName,
			@Param("authorName") String authorName,
			@Param("publisher") String publisher,
			@Param("publishedAtStart") LocalDate publishedAtStart,
			@Param("publishedAtEnd") LocalDate publishedAtEnd,
			@Param("categoryLevel1") Integer categoryLevel1,
			@Param("categoryLevel2") Integer categoryLevel2,
			@Param("status") String status,
			@Param("bookStatus") String bokStatus,
			@Param("region") String region);

}

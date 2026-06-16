package com.bold.application.repository.books;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import src.main.java.com.bold.application.entity.books.MstBookLog;

@Repository
public interface MstBookLogRepository extends JpaRepository<MstBookLog, Integer> {

	List<MstBookLog> findByLendUserId(String lendUserId);

	MstBookLog findByBookId(String bookId);

	void setReviewByLendId(String lendId, String review);
	void setUpdatedAtByLendId(String lendId, LocalDate updatedAt);
	void setHiddenFlgByLendId(String lendId, String hiddenFlg);

	void insertMstBookLog(int lendId,
			String bookId,
			String lendUserId,
			LocalDate createdAt,
			LocalDate updatedAt,
			String review,
			String hiddenFlg
			);
}

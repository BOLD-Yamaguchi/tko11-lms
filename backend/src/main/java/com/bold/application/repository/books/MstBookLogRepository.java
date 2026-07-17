package com.bold.application.repository.books;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.bold.application.entity.books.MstBookLog;

@Repository
public interface MstBookLogRepository extends JpaRepository<MstBookLog, Integer> {

	// ユーザ単位リスト取得
	List<MstBookLog> findByLendUserId(UUID lendUserId);

	// 書籍単位リスト取得
	List<MstBookLog> findByBookId(int bookId);

	// 書籍IDによるレコード取得
	List<MstBookLog> findByBookIdIn(List<Integer> bookIdList);

	// 貸出IDによるレコード取得
	MstBookLog findByLendId(int lendId);
	
	// 指定書籍の未返却履歴を新しい順で1件取得
	Optional<MstBookLog> findFirstByBookIdAndUpdatedAtIsNullOrderByLendIdDesc(int bookId);

}

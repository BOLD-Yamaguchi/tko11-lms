package com.bold.application.repository.books;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.bold.application.entity.books.MstBookLog;

@Repository
public interface MstBookLogRepository extends JpaRepository<MstBookLog, Integer> {

	// 全リスト取得
	List<MstBookLog> findAll();

	// ユーザ単位リスト取得
	List<MstBookLog> findByLendUserId(String lendUserId);

	// 書籍単位リスト取得
	List<MstBookLog> findByBookId(int bookId);

	// 貸出IDによるレコード取得
	MstBookLog findByLendId(int lendId);

	// 新規登録・更新
	@SuppressWarnings("unchecked")
	MstBookLog save(MstBookLog mstBookLog);

	// 複数登録
	List<MstBookLog> saveAll(List<MstBookLog> mstBookLogs);
}

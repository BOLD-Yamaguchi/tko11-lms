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
	
	// --- 【今回追加・推奨するメソッド】 ---

	/**
	 * 指定した書籍IDの中で、最も新しい（lendIdが大きい）ログを1件取得する
	 * （書籍の一覧や詳細で「現在の状態」を知るために使います）
	 */
	Optional<MstBookLog> findTopByBookIdOrderByLendIdDesc(int bookId);

	/**
	 * 複数冊の書籍IDリストを一括で受け取り、それぞれ「最新のログ」を効率よく取得したい場合などに使えるカスタムクエリ例
	 * （必要に応じて実装）
	 */
	// @Query("SELECT l FROM MstBookLog l WHERE l.lendId IN (SELECT MAX(sub.lendId) FROM MstBookLog sub GROUP BY sub.bookId) AND l.bookId IN :bookIds")
	// List<MstBookLog> findLatestLogsByBookIds(@Param("bookIds") List<Integer> bookIds);

}
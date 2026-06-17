package com.bold.application.repository.books;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.bold.application.entity.books.TrnBookStatus;

@Repository
public interface TrnBookStatusRepository extends JpaRepository<TrnBookStatus, Integer> {

	// 状態による書籍リスト取得
	List<TrnBookStatus> findByStatus(String status);

	// 状態更新
	TrnBookStatus save(int bookId, String status);
}


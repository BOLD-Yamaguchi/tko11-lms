package com.bold.application.repository.books;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.bold.application.entity.books.MstBookLog;

@Repository
public interface MstBookLogRepository extends JpaRepository<MstBookLog, Integer> {

	List<MstBookLog> findByLendUserId(String lendUserId);

	MstBookLog findByBookId(Integer bookId);
}

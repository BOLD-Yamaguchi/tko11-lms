package com.bold.application.repository.books;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.bold.application.entity.books.TrnBookStatus;

@Repository
public interface TrnBookStatusRepository extends JpaRepository<TrnBookStatus, Integer> {

	List<TrnBookStatus> findByStatus(String status);

	void setStatus(String bookId, String status);
}


package com.bold.application.repository.books;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import src.main.java.com.bold.application.entity.books.TrnBookStatus;

@Repository
public interface TrnBookStatusRepository extends JpaRepository<TrnBook, Integer> {

	List<TrnBookStatus> findByStatus(String status);

	void setStatus(String bookId, String status);
}


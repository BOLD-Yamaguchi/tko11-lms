package com.bold.application.repository.books;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.bold.application.entity.books.MstBookLog;

@Repository
public interface MstBookLogRepository extends JpaRepository<MstBookLog, int> {
}

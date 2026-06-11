package com.bold.application.repository.users;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.bold.application.entity.users.Book;

@Repository
public interface BookRepository extends JpaRepository<Book, Long> {
}

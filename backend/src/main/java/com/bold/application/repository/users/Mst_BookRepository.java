package com.bold.application.repository.users;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.bold.application.entity.users.Mst_Book;

@Repository
public interface Mst_BookRepository
    extends JpaRepository<Mst_Book, Long> {

}

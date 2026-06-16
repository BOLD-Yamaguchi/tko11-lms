package com.bold.application.repository.books;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.bold.application.entity.books.MstCategoryLevel1;

@Repository
public interface MstCategoryLevel1Repository extends JpaRepository<MstCategoryLevel1, Integer> {
}

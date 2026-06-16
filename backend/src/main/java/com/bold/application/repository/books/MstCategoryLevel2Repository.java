package com.bold.application.repository.books;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.bold.application.entity.books.MstCategoryLevel2;

@Repository
public interface MstCategoryLevel2Repository extends JpaRepository<MstCategoryLevel2, Integer> {
}

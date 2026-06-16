package com.bold.application.repository.books;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.bold.application.entity.books.MstCategoryLevel2;

@Repository
public interface MstCategoryLevel2Repository extends JpaRepository<MstCategoryLevel2, Integer> {

	/* 全ての中分類リストを取得 */
	List<MstCategoryLevel2> findAll();

	/* 中分類名から中分類情報を取得 */
	MstCategoryLevel2 findByCategoryLevel2Name(String categoryLevel2Name);
}

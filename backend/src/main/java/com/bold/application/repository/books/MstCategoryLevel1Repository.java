package com.bold.application.repository.books;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.bold.application.entity.books.MstCategoryLevel1;

@Repository
public interface MstCategoryLevel1Repository extends JpaRepository<MstCategoryLevel1, Integer> {

	/* 全ての大分類リストを取得 */
	List<MstCategoryLevel1> findAll();

	/* 大分類名から大分類情報を取得 */
	MstCategoryLevel1 findByCategoryLevel1Name(String categoryLevel1Name);
}

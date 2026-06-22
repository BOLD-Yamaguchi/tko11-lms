package com.bold.application.service.books;

import java.util.List;

import org.springframework.stereotype.Service;

import com.bold.application.entity.books.MstCategoryLevel2;
import com.bold.application.repository.books.MstCategoryLevel2Repository;

@Service
public class CategoryLevel2Service {

	private final MstCategoryLevel2Repository repository;

	public CategoryLevel1Service(MstCategoryLevel2Repository repository) {
		this.repository = repository;
	}

	// 全書籍検索
	public List<MstCategoryLevel1> findAll() {
		return repository.findAll();
	}
}

package com.bold.application.service.books;

import java.util.List;

import org.springframework.stereotype.Service;

import com.bold.application.entity.books.MstCategoryLevel1;
import com.bold.application.repository.books.MstCategoryLevel1Repository;

@Service
public class CategoryLevel1Service {

	private final MstCategoryLevel1Repository repository;

	public CategoryLevel1Service(MstCategoryLevel1Repository repository) {
		this.repository = repository;
	}

	// 全書籍検索
	public List<MstCategoryLevel1> findAll() {
		return repository.findAll();
	}
}

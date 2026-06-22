package com.bold.application.service.books;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.bold.application.entity.books.MstBook;
import com.bold.application.repository.books.MstBookRepository;

@Service
public class BookService {
	
	@Autowired
	private MstBookRepository repository;
	
	// 書籍情報一覧取得
	public List<MstBook> findAll() {
		return repository.findAll();
	}

	// 書籍詳細情報取得（１件）
	public MstBook findById(int bookId) {
		return repository.findByBookId(bookId);
	}

	// 新規書籍登録
	public MstBook create(MstBook mstBook) {
		return repository.save(mstBook);
	}

	// 書籍情報更新
	public MstBook update(MstBook mstBook) {
		return repository.save(mstBook);
	}

	// 書籍状態から書籍情報を取得
	public List<MstBook> getBookInfoByStatus(String status) {
		return repository.findByStatus(status);
	}

	// 書籍状態の更新
	public MstBook statusUpdate(int bookId, String status) {
		MstBook mstBook = repository.findByBookId(bookId);
		mstBook.setStatus(status);
		return repository.saveAndFlush(mstBook);
	}

}

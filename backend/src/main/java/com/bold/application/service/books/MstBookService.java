package com.bold.application.service.books;

import java.time.LocalDate;
import java.util.List;

import org.springframework.stereotype.Service;

import com.bold.application.entity.books.MstBook;
import com.bold.application.repository.books.MstBookRepository;

@Service
public class MstBookService {

	private final MstBookRepository mstBookRepository;

	public MstBookService(MstBookRepository mstBookRepository) {
		this.mstBookRepository = mstBookRepository;
	}

	public List<MstBook> findAll() {
		return mstBookRepository.findAll();
	}

	public List<MstBook> search(
			Integer bookId,
			String bookName,
			String authorName,
			String publisher,
			LocalDate publishedAtStart,
			LocalDate publishedAtEnd,
			Integer categoryLevel1,
			Integer categoryLevel2,
			String lendStatus,
			String status,
			String region) {
		return mstBookRepository.search(
				bookId,
				bookName,
				authorName,
				publisher,
				publishedAtStart,
				publishedAtEnd,
				categoryLevel1,
				categoryLevel2,
				lendStatus,
				status,
				region);
	}

	public MstBook create(MstBook mstBook) {
		return mstBookRepository.save(mstBook);
	}
}

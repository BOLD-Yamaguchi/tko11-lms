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

	// 全書籍検索
	public List<MstBook> findAll() {
		return mstBookRepository.findAll();
	}

	// 条件付き書籍検索
	public List<MstBook> search(
			Integer bookId,
			String bookName,
			String authorName,
			String publisher,
			LocalDate publishedAtStart,
				LocalDate publishedAtEnd,
				Integer categoryLevel1,
				Integer categoryLevel2,
				String bookStatus,
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
					bookStatus,
					status,
					region);
	}

	// 書籍登録
	public MstBook create(MstBook mstBook) {
		return mstBookRepository.save(mstBook);
	}

	// 書籍情報取得
	public MstBook findByBookId(int bookId) {
		return mstBookRepository.findByBookId(bookId);
	}
	
	// 借受リスト
	public List<MstBook> findBorrowingBooks() {
	    return mstBookRepository.findByStatusIn(
	        List.of("2", "3")
	    );
	}

	// 予約リスト
	public List<MstBook> findReservedBooks() {
	    return mstBookRepository.findByStatus("1");
	}
}

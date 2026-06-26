package com.bold.application.service.books;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.bold.application.dto.BorrowingRecordResponse;
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
		MstBook book = repository.findByBookId(mstBook.getBookId());
		book.setBookName(mstBook.getBookName());
		book.setIsbn(mstBook.getIsbn());
		book.setAuthorName(mstBook.getAuthorName());
		book.setPublisher(mstBook.getPublisher());
		book.setPublishedAt(mstBook.getPublishedAt());
		book.setCategoryLevel1Id(mstBook.getCategoryLevel1Id());
		book.setCategoryLevel2Id(mstBook.getCategoryLevel2Id());
		book.setBookStatus(mstBook.getBookStatus());
		book.setRegion(mstBook.getRegion());
		book.setShelfNo(mstBook.getShelfNo());
		book.setTierNo(mstBook.getTierNo());
		book.setMemo(mstBook.getMemo());
		book.setUpdatedAt(LocalDateTime.now(ZoneId.of("Asia/Tokyo")));
		return repository.save(book);
	}

	// 書籍状態から書籍情報を取得
	public List<MstBook> getBookInfoByStatus(String status) {
		return repository.findByStatus(status);
	}

	// 書籍状態の更新
	public MstBook statusUpdate(int bookId, String status) {
		MstBook mstBook = repository.findByBookId(bookId);
		mstBook.setStatus(status);
		mstBook.setStatusUpdatedAt(LocalDateTime.now(ZoneId.of("Asia/Tokyo")));
		return repository.save(mstBook);
	}

	// 貸出先ユーザIDの更新
	public MstBook lendUserUpdate(int bookId, UUID userId) {
		MstBook mstBook = repository.findByBookId(bookId);
		mstBook.setLendUserId(userId);
		return repository.save(mstBook);
	}

	// 一括返却
	public List<MstBook> bulkReturnBooks(List<BorrowingRecordResponse> borrowingRecordList) {
		try {
			//// BorrowingRecordResponseオブジェクトのリストから、bookId変数（int）だけを抽出してList<Integer>を作る
			List<Integer> bookIdList = borrowingRecordList.stream().map(BorrowingRecordResponse::getBookId).toList();
			// 書籍IDリストをキーに書籍データリストを取得
			List<MstBook> mstBookList = repository.findByBookIdIn(bookIdList);

			// List内の全オブジェクトの Status、StatusUpdatedAt を "0" 、現在日時に一括変更
			mstBookList.forEach(mstBook -> mstBook.setStatus("0"));
			mstBookList.forEach(mstBook -> mstBook.setLendUserId(null));
			mstBookList.forEach(mstBook -> mstBook.setStatusUpdatedAt(LocalDateTime.now(ZoneId.of("Asia/Tokyo"))));

			return repository.saveAll(mstBookList);

		} catch (Exception e) {
			throw e;
		}
	}
}

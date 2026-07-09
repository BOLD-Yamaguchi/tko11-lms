package com.bold.application.service.books;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.bold.application.dto.BorrowingRecordResponse;
import com.bold.application.dto.books.BookLogDto;
import com.bold.application.entity.books.MstBook;
import com.bold.application.entity.books.MstBookLog;
import com.bold.application.repository.books.MstBookLogRepository;
import com.bold.application.repository.books.MstBookRepository;

@Service
public class BookLogService {
	
	@Autowired
	private MstBookLogRepository repository;
	
	@Autowired
	private MstBookRepository bookRepository;

	// 貸出履歴一覧取得（全て）
	public List<BookLogDto> getAll() {
		return repository.findAll()
				.stream()
				.map(this::toDto)
				.toList();
	}

	// 貸出履歴一覧取得（書籍固有）
	public List<BookLogDto> getLogList(int bookId) {
		return repository.findByBookId(bookId)
				.stream()
				.map(this::toDto)
				.toList();
	}

	// 貸出履歴一覧取得（ユーザ固有：書籍情報を結合して返却）
	public List<BookLogDto> getLogList(UUID userId) {
		List<MstBookLog> logs = repository.findByLendUserId(userId);
		
		List<Integer> bookIds = logs.stream()
				.map(MstBookLog::getBookId)
				.distinct()
				.toList();
		
		List<MstBook> books = bookRepository.findByBookIdIn(bookIds);
		Map<Integer, MstBook> bookMap = books.stream()
				.collect(Collectors.toMap(MstBook::getBookId, b -> b));
		
		return logs.stream().map(log -> {
			BookLogDto dto = toDto(log);
			MstBook book = bookMap.get(log.getBookId());
			if (book != null) {
				dto.setTitle(book.getBookName());
				dto.setAuthor(book.getAuthorName());
			}
			return dto;
		}).toList();
	}

	private BookLogDto toDto(MstBookLog entity) {
		BookLogDto dto = new BookLogDto();
		
		dto.setLendId(entity.getLendId());
		dto.setBookId(entity.getBookId());
		dto.setLendUserId(entity.getLendUserId());
		dto.setReview(entity.getReview());
		dto.setHiddenFlg(entity.getHiddenFlg());
		if(entity.getCreatedAt() != null) {
			dto.setCreatedAt(entity.getCreatedAt());
		}
		if(entity.getUpdatedAt() != null) {
			dto.setUpdatedAt(entity.getUpdatedAt());
		}
		
		return dto;
	}

	// 貸出履歴取得（１件）
	public MstBookLog getBookLog(int lendId) {
		return repository.findByLendId(lendId);
	}

	// 新規履歴登録
	public MstBookLog create(MstBookLog mstBookLog) {
		return repository.save(mstBookLog);
	}

	// 新規履歴登録（複数一括）
	public List<MstBookLog> register(List<MstBookLog> mstBookLogList) {
		return repository.saveAll(mstBookLogList);
	}

	// 履歴更新（感想）
	public MstBookLog updateReview(MstBookLog mstBookLog, int lendId) {
		MstBookLog log = repository.findByLendId(lendId);
		log.setReview(mstBookLog.getReview());
		return repository.save(log);
	}

	// 履歴更新（返却日）
	public MstBookLog updateUpdatedAt(MstBookLog mstBookLog, int lendId) {
		MstBookLog log = repository.findByLendId(lendId);
		log.setUpdatedAt(mstBookLog.getUpdatedAt());
		return repository.save(log);
	}

	// 履歴更新（非表示フラグ）
	public MstBookLog updateHiddenFlg(MstBookLog mstBookLog, int lendId) {
		MstBookLog log = repository.findByLendId(lendId);
		log.setHiddenFlg(mstBookLog.getHiddenFlg());
		return repository.save(log);
	}

	// 一括返却
	public List<MstBookLog> bulkReturnBooks(List<BorrowingRecordResponse> borrowingRecordList) {
		try {
			List<Integer> bookIdList = borrowingRecordList.stream().map(BorrowingRecordResponse::getBookId).toList();
			List<MstBookLog> mstBookLogList = repository.findByBookIdIn(bookIdList);
			List<MstBookLog> filteredList = mstBookLogList.stream()
			    .filter(mstBookLog -> mstBookLog.getUpdatedAt() == null)
			    .collect(Collectors.toList());

			filteredList.forEach(mstBookLog -> mstBookLog.setUpdatedAt(LocalDateTime.now(ZoneId.of("Asia/Tokyo"))));

			return repository.saveAll(filteredList);

		} catch (Exception e) {
			throw e;
		}
	}
}
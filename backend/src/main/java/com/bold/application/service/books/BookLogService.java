package com.bold.application.service.books;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.bold.application.dto.books.BookLogDto;
import com.bold.application.entity.books.MstBookLog;
import com.bold.application.repository.books.MstBookLogRepository;

@Service
public class BookLogService {
	
	@Autowired
	private MstBookLogRepository repository;
	
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

	// 貸出履歴一覧取得（ユーザ固有）
	public List<BookLogDto> getLogList(UUID userId) {
		return repository.findByLendUserId(userId)
				.stream()
				.map(this::toDto)
				.toList();
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
}

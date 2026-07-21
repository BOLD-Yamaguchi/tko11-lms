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
import com.bold.application.entity.users.User;
import com.bold.application.repository.books.MstBookLogRepository;
import com.bold.application.repository.books.MstBookRepository;
import com.bold.application.repository.users.UserRepository; // 1. インポート追加

@Service
public class BookLogService {
	
	@Autowired
	private MstBookLogRepository repository;
	
	@Autowired
	private MstBookRepository bookRepository;

	@Autowired // 2. 依存性の注入を追加
	private UserRepository userRepository;

	// 貸出履歴一覧取得（全て）
	public List<BookLogDto> getAll() {
		// 3. 共通ロジックを使用して書籍情報とユーザー名を結合して取得
		return mapLogsWithBookInfo(repository.findAll());
	}

	// 貸出履歴一覧取得（書籍固有）
	public List<BookLogDto> getLogList(int bookId) {
		return mapLogsWithBookInfo(repository.findByBookId(bookId));
	}

	// 貸出履歴一覧取得（ユーザ固有）
	public List<BookLogDto> getLogList(UUID userId) {
		return mapLogsWithBookInfo(repository.findByLendUserId(userId));
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

	public MstBookLog getBookLog(int lendId) {
		return repository.findByLendId(lendId);
	}

	public MstBookLog create(MstBookLog mstBookLog) {
		return repository.save(mstBookLog);
	}

	// 貸出時に mst_book_log へ貸出履歴を新規登録
	public MstBookLog createLendingLog(
	        int bookId,
	        UUID lendUserId) {

	    MstBookLog bookLog = new MstBookLog();

	    bookLog.setBookId(bookId);
	    bookLog.setLendUserId(lendUserId);
	    bookLog.setCreatedAt(
	            LocalDateTime.now(ZoneId.of("Asia/Tokyo")));
	    // 貸出時点では未返却・感想未入力
	    bookLog.setUpdatedAt(null);
	    bookLog.setReview(null);
	    // 初期状態では履歴を表示する
	    bookLog.setHiddenFlg("0");

	    return repository.save(bookLog);
	}
	
	public List<MstBookLog> register(List<MstBookLog> mstBookLogList) {
		return repository.saveAll(mstBookLogList);
	}

	public MstBookLog updateReview(MstBookLog mstBookLog, int lendId) {
		MstBookLog log = repository.findByLendId(lendId);
		log.setReview(mstBookLog.getReview());
		return repository.save(log);
	}

	public MstBookLog updateUpdatedAt(MstBookLog mstBookLog, int lendId) {
		MstBookLog log = repository.findByLendId(lendId);
		log.setUpdatedAt(mstBookLog.getUpdatedAt());
		return repository.save(log);
	}

	public MstBookLog updateHiddenFlg(MstBookLog mstBookLog, int lendId) {
		MstBookLog log = repository.findByLendId(lendId);
		log.setHiddenFlg(mstBookLog.getHiddenFlg());
		return repository.save(log);
	}

	public List<MstBookLog> bulkReturnBooks(List<BorrowingRecordResponse> borrowingRecordList) {
		List<Integer> bookIdList = borrowingRecordList.stream().map(BorrowingRecordResponse::getBookId).toList();
		List<MstBookLog> mstBookLogList = repository.findByBookIdIn(bookIdList);
		List<MstBookLog> filteredList = mstBookLogList.stream()
			.filter(mstBookLog -> mstBookLog.getUpdatedAt() == null)
			.collect(Collectors.toList());

		filteredList.forEach(mstBookLog -> mstBookLog.setUpdatedAt(LocalDateTime.now(ZoneId.of("Asia/Tokyo"))));
		return repository.saveAll(filteredList);
	}

	public List<BookLogDto> getLogListByUser(User user) {
		// 管理者(2)の場合は全件取得
		if (user.getAdminKbn() != null && user.getAdminKbn() == 2) {
			return mapLogsWithBookInfo(repository.findAll());
		}
		// それ以外は自分自身の履歴のみ取得
		return getLogList(user.getUserId());
	}

	// 書籍情報とユーザー名を結合する共通ロジック
	private List<BookLogDto> mapLogsWithBookInfo(List<MstBookLog> logs) {
		List<Integer> bookIds = logs.stream().map(MstBookLog::getBookId).distinct().toList();
		List<UUID> userIds = logs.stream().map(MstBookLog::getLendUserId).distinct().toList();
		
		List<MstBook> books = bookRepository.findByBookIdIn(bookIds);
		Map<Integer, MstBook> bookMap = books.stream().collect(Collectors.toMap(MstBook::getBookId, b -> b));
		
		List<User> users = userRepository.findByUserIdIn(userIds);
		Map<UUID, User> userMap = users.stream().collect(Collectors.toMap(
			    User::getUserId, 
			    u -> u, 
			    (existing, replacement) -> existing
			));		
		return logs.stream().map(log -> {
			BookLogDto dto = toDto(log);
			
			MstBook book = bookMap.get(log.getBookId());
			if (book != null) {
				dto.setTitle(book.getBookName());
				dto.setAuthor(book.getAuthorName());
			}
			
			User user = userMap.get(log.getLendUserId());
			System.out.println("★デバッグ: 検索ID=" + log.getLendUserId() + " 取得できたUser=" + user); // これを追加
			dto.setBorrower(user != null ? user.getUsername() : "不明");
			
			return dto;
		}).toList();
	}
	
	// 最新の未返却履歴に返却日時を登録
	public MstBookLog completeReturnLog(int bookId) {

	    MstBookLog bookLog = repository
	            .findFirstByBookIdAndUpdatedAtIsNullOrderByLendIdDesc(bookId)
	            .orElseThrow(() ->
	                    new IllegalStateException(
	                            "未返却の貸出履歴が見つかりません。"));

	    bookLog.setUpdatedAt(
	            LocalDateTime.now(ZoneId.of("Asia/Tokyo")));

	    return repository.save(bookLog);
	}
	
	// 最新の未返却履歴に返却申請時の感想を登録
	public MstBookLog updateReturnReview(
	        int bookId,
	        String review) {

	    MstBookLog bookLog = repository
	            .findFirstByBookIdAndUpdatedAtIsNullOrderByLendIdDesc(bookId)
	            .orElseThrow(() ->
	                    new IllegalStateException(
	                            "未返却の貸出履歴が見つかりません。"));

	    // 感想は任意。空文字の場合はNULLとして保存
	    bookLog.setReview(
	            review == null || review.isBlank()
	                    ? null
	                    : review.trim());

	    return repository.save(bookLog);
	}
}
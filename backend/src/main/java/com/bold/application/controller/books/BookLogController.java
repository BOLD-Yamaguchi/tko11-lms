package com.bold.application.controller.books;

import java.util.List;
import java.util.UUID;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.bold.application.dto.books.BookLogDto;
import com.bold.application.entity.books.MstBookLog;
import com.bold.application.service.books.BookLogService;

@RestController
@RequestMapping("/book")
@CrossOrigin(origins = "http://localhost:5173", methods = {
		RequestMethod.GET,
		RequestMethod.POST,
		RequestMethod.PUT,
		RequestMethod.DELETE,
		RequestMethod.OPTIONS
})
public class BookLogController {

	private final BookLogService bookLogService;

	public BookLogController(BookLogService bookLogService) {
		this.bookLogService = bookLogService;
	}

	// 貸出履歴取得API
	@GetMapping("/history-lists-all")
	public List<BookLogDto> getBookLogs() {
		return bookLogService.getAll();
	}

	// 貸出履歴取得API（書籍固有：書籍詳細画面用）
	@GetMapping("/history-lists-book")
	public List<BookLogDto> getBookLogsByBookId(
			@RequestParam int bookId) {
		return bookLogService.getLogList(bookId);
	}

	// 貸出履歴取得API（ユーザ固有：マイページ用）
	@GetMapping("/history-lists-user")
	public List<BookLogDto> getBookLogsByUserId(
			@RequestParam UUID userId) {
		return bookLogService.getLogList(userId);
	}

	// 書籍履歴管理API（非表示フラグの設定）
	@PutMapping("/history-manage")
	public MstBookLog setHiddenFlg(
			@RequestParam int lendId,
			@RequestParam String hiddenFlg) {
		MstBookLog bookLog = bookLogService.getBookLog(lendId);
		bookLog.setHiddenFlg(hiddenFlg);
		return bookLogService.updateHiddenFlg(bookLog, lendId);
	}
}

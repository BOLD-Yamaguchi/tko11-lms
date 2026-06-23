package com.bold.application.controller.books;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

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
	@GetMapping("/history-lists")
	public List<MstBookLog> getBookLogs() {
		return bookLogService.getAll();
	}

	// 書籍履歴管理API（非表示フラグの設定）
	@PutMapping("/history-manage")
	public MstBookLog setHiddenFlg(int lendId, String hiddenFlg) {
		MstBookLog bookLog = bookLogService.getBookLog(lendId);
		bookLog.setHiddenFlg(hiddenFlg);
		return bookLogService.updateHiddenFlg(bookLog, lendId);
	}
}

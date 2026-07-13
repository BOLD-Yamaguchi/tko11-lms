package com.bold.application.controller.books;

import java.util.Collections;
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
import com.bold.application.entity.users.User;
import com.bold.application.service.UserService;
import com.bold.application.service.books.BookLogService;

@RestController
@RequestMapping("/book")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"}, methods = {
		RequestMethod.GET,
		RequestMethod.POST,
		RequestMethod.PUT,
		RequestMethod.DELETE,
		RequestMethod.OPTIONS
})
public class BookLogController {

	private final BookLogService bookLogService;
	private final UserService userService;

	// UserService をコンストラクタに追加
	public BookLogController(BookLogService bookLogService, UserService userService) {
		this.bookLogService = bookLogService;
		this.userService = userService;
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
	        @RequestParam String userId) { 
	    
	    System.out.println("★デバッグ: 受け取ったUUID = " + userId);
	    
	    // UUID文字列を UUID 型に変換
	    UUID uuid = UUID.fromString(userId);
	    
	    // UserServiceを使って、UUIDからUser情報をデータベースから取得する
	    User user = userService.getUserById(uuid);
	    
	    if (user == null) {
	        System.out.println("★デバッグ: ユーザーが見つかりませんでした");
	        return Collections.emptyList(); 
	    }
	    
	    // 取得したUser情報を、権限判定付きのメソッドに渡す
	    List<BookLogDto> list = bookLogService.getLogListByUser(user);
	    
	    System.out.println("★デバッグ: 取得した履歴件数 = " + list.size());
	    
	    return list;
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
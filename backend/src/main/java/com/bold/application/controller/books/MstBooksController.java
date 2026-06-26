package com.bold.application.controller.books;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.bold.application.dto.BorrowingRecordRequest;
import com.bold.application.dto.BorrowingRecordResponse;
import com.bold.application.entity.books.MstBook;
import com.bold.application.service.books.BookLogService;
import com.bold.application.service.books.BookService;

import lombok.Data;

@RestController
@RequestMapping("/books")
@CrossOrigin(origins = "http://localhost:5173", methods = {
		RequestMethod.GET,
		RequestMethod.POST,
		RequestMethod.PUT,
		RequestMethod.DELETE,
		RequestMethod.OPTIONS
})
public class MstBooksController {

	private static final Logger logger = LoggerFactory.getLogger(MstBooksController.class);

	private final BookService bookService;
	private final BookLogService bookLogService;

	public MstBooksController(BookService bookService, BookLogService bookLogService) {
		this.bookService = bookService;
		this.bookLogService = bookLogService;
	}

	@Data // Lombokを使用する場合。手動でGetter/Setterを定義してもOK
	public class UserRequest {
	    private String title;
	}

	// 一括返却API
	@PostMapping("/bulk-return")
	public ResponseEntity<?> bulkReturnBooks(@RequestBody BorrowingRecordRequest request) {
		try {
			// 一括返却対象の書籍データリストを取得
			List<BorrowingRecordResponse> borrowingRecordList = request.getRecords();
			// 書籍一括返却サービスを呼び出し
			List<MstBook> mstBookList = bookService.bulkReturnBooks(borrowingRecordList);
			bookLogService.bulkReturnBooks(borrowingRecordList);
			logger.info("書籍の一括返却が完了しました。");

			return ResponseEntity.ok(mstBookList);
		} catch (Exception e) {
			logger.error("書籍の一括返却中にエラーが発生しました: " + e.getMessage());
			return ResponseEntity.internalServerError().body("エラーが発生しました: " + e.getMessage());
		}
	}
}

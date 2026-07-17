package com.bold.application.controller.books;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.bold.application.dto.BorrowingRecordResponse;
import com.bold.application.dto.ReservationRecordResponse;
import com.bold.application.dto.books.BookRegisterRequest;
import com.bold.application.dto.books.BookSearchRequest;
import com.bold.application.dto.books.BookSearchResponse;
import com.bold.application.entity.books.MstBook;
import com.bold.application.entity.users.User;
import com.bold.application.repository.users.UserRepository;
import com.bold.application.service.books.BookLogService;
import com.bold.application.service.books.BookService;
import com.bold.application.service.books.BorrowingService;
import com.bold.application.service.books.MstBookService;
import com.bold.application.service.books.ReservationService;

@RestController
@RequestMapping("/book")
@CrossOrigin(origins = { "http://localhost:5173", "http://localhost:5174" }, methods = {
		RequestMethod.GET,
		RequestMethod.POST,
		RequestMethod.PUT,
		RequestMethod.DELETE,
		RequestMethod.OPTIONS
})
public class MstBookController {

	private final MstBookService mstBookService;
	private final BorrowingService borrowingService;
	private final ReservationService reservationService;
	private final BookService bookService;
	private final BookLogService bookLogService;
	private final UserRepository userRepository;

	public MstBookController(
			MstBookService mstBookService,
			BorrowingService borrowingService,
			ReservationService reservationService,
			BookService bookService,
			BookLogService bookLogService,
			UserRepository userRepository) {

		this.mstBookService = mstBookService;
		this.borrowingService = borrowingService;
		this.reservationService = reservationService;
		this.bookService = bookService;
		this.bookLogService = bookLogService;
		this.userRepository = userRepository;
	}

	// 書籍登録
	@PostMapping("/create")
	public ResponseEntity<MstBook> createBookNew(@Valid @RequestBody BookRegisterRequest request) {
		BookRegisterRequest data = request.getBook() != null ? request.getBook() : request;

		MstBook mstBook = new MstBook();
		mstBook.setBookName(data.getTitle());
		mstBook.setIsbn(data.getIsbn());
		mstBook.setAuthorName(data.getAuthor());
		mstBook.setPublisher(data.getPublisher());
		mstBook.setPublishedAt(data.getPublishedAt());
		mstBook.setMemo(data.getNotes());
		mstBook.setShelfNo(data.getShelfNumber());

		// tierNo の数値変換
		if (data.getTierNumber() != null && !data.getTierNumber().isEmpty()) {
			try {
				mstBook.setTierNo(Integer.parseInt(data.getTierNumber()));
			} catch (NumberFormatException e) {
				mstBook.setTierNo(0);
			}
		}

		// カテゴリの数値変換
		try {
			if (data.getMajorCategory() != null && !data.getMajorCategory().isEmpty()) {
				mstBook.setCategoryLevel1Id(Integer.parseInt(data.getMajorCategory()));
			}
		} catch (NumberFormatException e) {
			mstBook.setCategoryLevel1Id(0);
		}

		if (data.getMinorCategory() != null && !data.getMinorCategory().isEmpty()) {
			try {
				mstBook.setCategoryLevel2Id(Integer.parseInt(data.getMinorCategory()));
			} catch (NumberFormatException e) {
				mstBook.setCategoryLevel2Id(null);
			}
		} else {
			mstBook.setCategoryLevel2Id(null);
		}

		// 地域コードの設定
		if ("大阪".equals(data.getLocation()) || "1".equals(data.getLocation())) {
			mstBook.setRegion("1");
		} else {
			mstBook.setRegion("0");
		}

		// 蔵書ステータス（開架: "0", 閉架: "1", 廃棄: "2"）
		if ("閉架".equals(data.getCollectionStatus()) || "1".equals(data.getCollectionStatus())) {
			mstBook.setBookStatus("1");
		} else if ("廃棄".equals(data.getCollectionStatus()) || "2".equals(data.getCollectionStatus())) {
			mstBook.setBookStatus("2");
		} else {
			mstBook.setBookStatus("0");
		}

		// 初期ステータス（0: 貸出可）とタイムスタンプの設定
		mstBook.setStatus("0");
		LocalDateTime now = LocalDateTime.now();
		mstBook.setCreatedAt(now);
		mstBook.setBookInfoUpdatedAt(now);
		mstBook.setStatusUpdatedAt(now);
		mstBook.setReturnedAt(null);

		MstBook savedBook = mstBookService.create(mstBook);
		return ResponseEntity.ok(savedBook);
	}

	// テスト用
	@GetMapping("/search/all")
	public List<BookSearchResponse> getBooks() {
		return mstBookService.findAll()
				.stream()
				.map(this::toSearchResponse)
				.toList();
	}

	// 書籍検索API
	@GetMapping("/search")
	public List<BookSearchResponse> searchBooks(@ModelAttribute BookSearchRequest request) {
		return mstBookService.search(
				request.getBookId(),
				request.getBookName(),
				request.getAuthorName(),
				request.getPublisher(),
				request.getPublishedAtStart(),
				request.getPublishedAtEnd(),
				request.getCategoryLevel1(),
				request.getCategoryLevel2(),
				request.getBookStatus(),
				request.getStatus(),
				request.getRegion())
				.stream()
				.map(this::toSearchResponse)
				.toList();
	}

	@GetMapping("/borrow-lists")
	public List<BorrowingRecordResponse> getBorrowLists() {
		return borrowingService.findBorrowingList();
	}

	@GetMapping("/reservation-lists")
	public List<ReservationRecordResponse> getReservationLists() {
		return reservationService.findReservationList();
	}

	// 書籍登録
	@PostMapping
	public MstBook createBook(@RequestBody MstBook mstBook) {
		return mstBookService.create(mstBook);
	}

	// 書籍予約
	@PostMapping("/reserve")
	@Transactional
	public ResponseEntity<?> reserveBook(@RequestBody Map<String, Object> payload) {

		System.out.println("--- 画面から届いたデータ: " + payload);

		try {
			Object bId = payload.get("bookId") != null ? payload.get("bookId") : payload.get("book_id");
			Object uId = payload.get("userId") != null ? payload.get("userId") : payload.get("user_id");

			if (bId == null) {
				return ResponseEntity.badRequest().body("bookId が見つかりません。");
			}

			int bookId = Integer.parseInt(bId.toString());
			MstBook updatedBook = bookService.statusUpdate(bookId, "1");
			if (uId != null) {
				String userIdStr = uId.toString();
				if (userIdStr.contains("-") && userIdStr.length() > 30) {
					UUID userId = UUID.fromString(userIdStr);
					bookService.lendUserUpdate(bookId, userId);
				} else {
					System.out.println("--- [注意] userId '" + userIdStr + "' はUUID形式ではないため、今回はユーザーID更新をスキップします");
				}
			}

			return ResponseEntity.ok(updatedBook);

		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.internalServerError().body("エラーが発生しました: " + e.getMessage());
		}
	}

	// 書籍貸出API
	@PostMapping("/lend")
	@Transactional
	public ResponseEntity<?> lendBook(
	        @RequestBody Map<String, Object> payload) {

	    System.out.println("--- 貸出APIに届いたデータ: " + payload);

	    try {
	        Object bId = payload.get("bookId") != null ? payload.get("bookId") : payload.get("book_id");

	        Object employeeCodeValue = payload.get("employeeCode");

	        if (bId == null) {
	            return ResponseEntity.badRequest()
	                    .body("bookId が見つかりません。");
	        }

	        if (employeeCodeValue == null
	                || employeeCodeValue.toString().isBlank()) {
	            return ResponseEntity.badRequest()
	                    .body("社員番号を入力してください。");
	        }

	        int bookId = Integer.parseInt(bId.toString());
	        String employeeCode = employeeCodeValue.toString();

	        User user = userRepository
	                .findByEmployeeCode(employeeCode)
	                .orElse(null);

	        if (user == null) {
	            return ResponseEntity.badRequest()
	                    .body("入力された社員番号は存在しません。");
	        }

	        UUID userId = user.getUserId();

	        // ステータスを「2」（貸出中）に更新
	        MstBook updatedBook =
	                bookService.statusUpdate(bookId, "2");

	        // 社員番号に対応するUUIDを貸出先ユーザーIDへ設定
	        bookService.lendUserUpdate(bookId, userId);
	        
	        // 貸出履歴を新規登録
	        bookLogService.createLendingLog(bookId, userId);

	        return ResponseEntity.ok(updatedBook);

	    } catch (NumberFormatException e) {
	        return ResponseEntity.badRequest()
	                .body("bookId の形式が不正です。");

	    } catch (Exception e) {
	        e.printStackTrace();

	        return ResponseEntity.internalServerError()
	                .body("エラーが発生しました: " + e.getMessage());
	    }
	}

	// 返却申請
	@PostMapping("/return-request")
	@Transactional
	public ResponseEntity<?> requestReturn(@RequestBody Map<String, Object> payload) {

		System.out.println("--- 返却申請APIに届いたデータ: " + payload);

		try {
			Object bId = payload.get("bookId") != null
					? payload.get("bookId")
					: payload.get("book_id");
			
			Object employeeCodeValue = payload.get("employeeCode");
			
			Object reviewValue = payload.get("comment");
			String review = reviewValue == null ? null : reviewValue.toString();
			
			if (bId == null) {
				return ResponseEntity.badRequest()
						.body("bookId が見つかりません。");
			}
			
	        if (employeeCodeValue == null
	                || employeeCodeValue.toString().isBlank()) {
	            return ResponseEntity.badRequest()
	                    .body("社員番号を入力してください。");
	        }

			int bookId = Integer.parseInt(bId.toString());
	        String employeeCode = employeeCodeValue.toString();

	        User user = userRepository
	                .findByEmployeeCode(employeeCode)
	                .orElse(null);
	        
	        if (user == null) {
	            return ResponseEntity.badRequest()
	                    .body("入力された社員番号は存在しません。");
	        }

	        MstBook book = bookService.findById(bookId);
	        
	        if (book == null) {
	            return ResponseEntity.badRequest()
	                    .body("指定された書籍が存在しません。");
	        }

	        if (!"2".equals(book.getStatus())) {
	            return ResponseEntity.badRequest()
	                    .body("貸出中の書籍だけ返却申請できます。");
	        }

	        if (book.getLendUserId() == null
	                || !book.getLendUserId().equals(user.getUserId())) {
	            return ResponseEntity.badRequest()
	                    .body("この書籍の貸出者と社員番号が一致しません。");
	        }
	        
	        // 返却申請時の感想を最新の貸出履歴へ保存
	        bookLogService.updateReturnReview(bookId, review);

			// ステータスを「3：返却申請中」に変更
			MstBook updatedBook = bookService.statusUpdate(bookId, "3");

			return ResponseEntity.ok(updatedBook);

		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.internalServerError()
					.body("エラーが発生しました: " + e.getMessage());
		}
	}
	
	// 返却申請取消・却下
	@PostMapping("/return-reject")
	@Transactional
	public ResponseEntity<?> rejectReturnRequest(
	        @RequestBody Map<String, Object> payload) {

	    try {
	        Object bId = payload.get("bookId") != null
	                ? payload.get("bookId")
	                : payload.get("book_id");

	        if (bId == null) {
	            return ResponseEntity.badRequest()
	                    .body("bookId が見つかりません。");
	        }

	        int bookId = Integer.parseInt(bId.toString());

	        // 返却申請中「3」から貸出中「2」へ戻す
	        MstBook updatedBook = bookService.statusUpdate(bookId, "2");

	        return ResponseEntity.ok(updatedBook);

	    } catch (Exception e) {
	        e.printStackTrace();
	        return ResponseEntity.internalServerError()
	                .body("エラーが発生しました: " + e.getMessage());
	    }
	}

	// 直接返却
	@PostMapping("/direct-return")
	@Transactional
	public ResponseEntity<?> directReturn(
	        @RequestBody Map<String, Object> payload) {

	    System.out.println("--- 直接返却APIに届いたデータ: " + payload);

	    try {
	        Object bId = payload.get("bookId") != null
	                ? payload.get("bookId")
	                : payload.get("book_id");

	        Object employeeCodeValue = payload.get("employeeCode");

	        if (bId == null) {
	            return ResponseEntity.badRequest()
	                    .body("bookId が見つかりません。");
	        }

	        if (employeeCodeValue == null
	                || employeeCodeValue.toString().isBlank()) {
	            return ResponseEntity.badRequest()
	                    .body("社員番号を入力してください。");
	        }

	        int bookId = Integer.parseInt(bId.toString());
	        String employeeCode = employeeCodeValue.toString().trim();

	        User user = userRepository
	                .findByEmployeeCode(employeeCode)
	                .orElse(null);

	        if (user == null) {
	            return ResponseEntity.badRequest()
	                    .body("入力された社員番号は存在しません。");
	        }

	        MstBook book = bookService.findById(bookId);

	        if (book == null) {
	            return ResponseEntity.badRequest()
	                    .body("指定された書籍が存在しません。");
	        }

	        if (!"2".equals(book.getStatus())) {
	            return ResponseEntity.badRequest()
	                    .body("貸出中の書籍だけ直接返却できます。");
	        }

	        if (book.getLendUserId() == null
	                || !book.getLendUserId().equals(user.getUserId())) {
	            return ResponseEntity.badRequest()
	                    .body("この書籍の貸出者と社員番号が一致しません。");
	        }

	        // 貸出可へ変更
	        bookService.statusUpdate(bookId, "0");

	        // 貸出者UUIDを解除
	        MstBook updatedBook =
	                bookService.lendUserUpdate(bookId, null);
	        
	        // 最新の貸出履歴に返却日時を登録
	        bookLogService.completeReturnLog(bookId);

	        return ResponseEntity.ok(updatedBook);

	    } catch (Exception e) {
	        e.printStackTrace();
	        return ResponseEntity.internalServerError()
	                .body("エラーが発生しました: " + e.getMessage());
	    }
	}
	
	// 返却承認
	@PostMapping("/return")
	@Transactional
	public ResponseEntity<?> approveReturn(
	        @RequestBody Map<String, Object> payload) {

	    try {
	        Object bId = payload.get("bookId") != null
	                ? payload.get("bookId")
	                : payload.get("book_id");

	        if (bId == null) {
	            return ResponseEntity.badRequest()
	                    .body("bookId が見つかりません。");
	        }

	        int bookId = Integer.parseInt(bId.toString());

	        // 返却後は貸出可「0」へ変更
	        MstBook updatedBook = bookService.statusUpdate(bookId, "0");

	        // 貸出者のUUIDを解除
	        bookService.lendUserUpdate(bookId, null);
	        
	        // 最新の貸出履歴に返却日時を登録
	        bookLogService.completeReturnLog(bookId);

	        return ResponseEntity.ok(updatedBook);

	    } catch (Exception e) {
	        e.printStackTrace();
	        return ResponseEntity.internalServerError()
	                .body("エラーが発生しました: " + e.getMessage());
	    }
	}

	// 書籍予約取消
	@PostMapping("/cancel-reservation")
	@Transactional
	public ResponseEntity<?> cancelReservation(
	        @RequestBody Map<String, Object> payload) {

	    System.out.println("--- 予約取消APIに届いたデータ: " + payload);

	    try {
	        // 画面から届いたbookIdと社員番号を取得
	        Object bId = payload.get("bookId") != null
	                ? payload.get("bookId")
	                : payload.get("book_id");

	        Object employeeCodeValue = payload.get("employeeCode");

	        if (bId == null) {
	            return ResponseEntity.badRequest()
	                    .body("bookId が見つかりません。");
	        }

	        if (employeeCodeValue == null
	                || employeeCodeValue.toString().isBlank()) {
	            return ResponseEntity.badRequest()
	                    .body("社員番号を入力してください。");
	        }

	        int bookId = Integer.parseInt(bId.toString());
	        String employeeCode = employeeCodeValue.toString().trim();

	        // 操作しているユーザーを社員番号から取得
	        User operationUser = userRepository
	                .findByEmployeeCode(employeeCode)
	                .orElse(null);

	        if (operationUser == null) {
	            return ResponseEntity.badRequest()
	                    .body("入力された社員番号は存在しません。");
	        }

	        // 予約取消対象の書籍を取得
	        MstBook book = bookService.findById(bookId);

	        if (book == null) {
	            return ResponseEntity.badRequest()
	                    .body("指定された書籍が存在しません。");
	        }

	        // 予約中の書籍だけ取消可能
	        if (!"1".equals(book.getStatus())) {
	            return ResponseEntity.badRequest()
	                    .body("予約中の書籍だけ予約を取り消せます。");
	        }

	        // 一般ユーザーかどうかを確認
	        boolean isGeneralUser =
	                Integer.valueOf(0).equals(operationUser.getAdminKbn());

	        // 一般ユーザーは、自分が予約した書籍だけ取消可能
	        if (isGeneralUser
	                && (book.getLendUserId() == null
	                || !book.getLendUserId().equals(operationUser.getUserId()))) {

	            return ResponseEntity.badRequest()
	                    .body("自分の予約だけ取り消せます。");
	        }

	        // ステータスを「0：貸出可」に戻す
	        MstBook updatedBook =
	                bookService.statusUpdate(bookId, "0");

	        // 予約者のUUIDを解除
	        bookService.lendUserUpdate(bookId, null);

	        return ResponseEntity.ok(updatedBook);

	    } catch (NumberFormatException e) {
	        return ResponseEntity.badRequest()
	                .body("bookId の形式が不正です。");

	    } catch (Exception e) {
	        e.printStackTrace();

	        return ResponseEntity.internalServerError()
	                .body("エラーが発生しました: " + e.getMessage());
	    }
	}

	private BookSearchResponse toSearchResponse(MstBook mstBook) {
		return BookSearchResponse.from(mstBook);
	}

	// MstBookController.java に追加
	//    @GetMapping("/history-lists-user")
	//    public List<BorrowingRecordResponse> getHistoryList(@RequestParam String employeeCode) {
	//        return borrowingService.findHistoryByEmployeeCode(employeeCode);
	//    }
}

package com.bold.application.controller.books;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

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
import com.bold.application.service.books.BookService;
import com.bold.application.service.books.BorrowingService;
import com.bold.application.service.books.MstBookService;
import com.bold.application.service.books.ReservationService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/book")
@CrossOrigin(
    origins = "http://localhost:5173",
    methods = {
        RequestMethod.GET,
        RequestMethod.POST,
        RequestMethod.PUT,
        RequestMethod.DELETE,
        RequestMethod.OPTIONS
    }
)
public class MstBookController {

    private final MstBookService mstBookService;
    private final BorrowingService borrowingService;
    private final ReservationService reservationService;
    private final BookService bookService;

    public MstBookController(
            MstBookService mstBookService,
            BorrowingService borrowingService,
            ReservationService reservationService,
            BookService bookService) {

        this.mstBookService = mstBookService;
        this.borrowingService = borrowingService;
        this.reservationService = reservationService;
        this.bookService = bookService;
    }

    // 書籍登録
    @PostMapping("/create")
    public ResponseEntity<MstBook> createBookNew(@Valid @RequestBody BookRegisterRequest request) {
        BookRegisterRequest data = request.getBook() != null ? request.getBook() : request;

        System.out.println("MajorCategory (String): " + data.getMajorCategory());
        System.out.println("MinorCategory (String): " + data.getMinorCategory());

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
    public ResponseEntity<?> lendBook(@RequestBody Map<String, Object> payload) {

        System.out.println("--- 貸出APIに届いたデータ: " + payload);

        try {
            Object bId = payload.get("bookId") != null ? payload.get("bookId") : payload.get("book_id");
            Object uId = payload.get("userId") != null ? payload.get("userId") : payload.get("user_id");

            if (bId == null) {
                return ResponseEntity.badRequest().body("bookId が見つかりません。");
            }

            int bookId = Integer.parseInt(bId.toString());

            // ステータスを「2」（貸出中）に更新
            MstBook updatedBook = bookService.statusUpdate(bookId, "2");

            if (uId != null) {
                String userIdStr = uId.toString();
                if (userIdStr.contains("-") && userIdStr.length() > 30) {
                    UUID userId = UUID.fromString(userIdStr);
                    bookService.lendUserUpdate(bookId, userId);
                } else {
                    System.out.println("--- [注意] userId '" + userIdStr + "' はUUID形式ではないため、ユーザーID更新をスキップします");
                }
            }

            return ResponseEntity.ok(updatedBook);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("エラーが発生しました: " + e.getMessage());
        }
    }

    // 書籍予約取消
    @PostMapping("/cancel-reservation")
    @Transactional
    public ResponseEntity<?> cancelReservation(@RequestBody Map<String, Object> payload) {

        System.out.println("--- 予約取消APIに届いたデータ: " + payload);

        try {
            // 画面から届いたデータから bookId を取得
            Object bId = payload.get("bookId") != null ? payload.get("bookId") : payload.get("book_id");

            if (bId == null) {
                return ResponseEntity.badRequest().body("bookId が見つかりません。");
            }

            int bookId = Integer.parseInt(bId.toString());

            // ステータスを「0」（利用可能/在庫あり）に戻す
            // ※もしプロジェクトのルールで「未予約」のコード値が「0」以外なら変更してください
            MstBook updatedBook = bookService.statusUpdate(bookId, "0");

            // 貸出・予約先ユーザーIDをクリアする（nullをセット）
            bookService.lendUserUpdate(bookId, null);

            // 成功したら最新の書籍情報を画面に返す
            return ResponseEntity.ok(updatedBook);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("エラーが発生しました: " + e.getMessage());
        }
    }

    private BookSearchResponse toSearchResponse(MstBook mstBook) {
        return BookSearchResponse.from(mstBook);
    }
}

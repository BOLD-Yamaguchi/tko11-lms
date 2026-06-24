package com.bold.application.controller.books;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.bold.application.dto.BorrowingRecordResponse;
import com.bold.application.dto.books.BookSearchRequest;
import com.bold.application.dto.books.BookSearchResponse;
import com.bold.application.entity.books.MstBook;
import com.bold.application.service.books.BorrowingService;
import com.bold.application.service.books.MstBookService;

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

    public MstBookController(
            MstBookService mstBookService,
            BorrowingService borrowingService) {

        this.mstBookService = mstBookService;
        this.borrowingService = borrowingService;
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

    // 借受リスト
    @GetMapping("/borrow-lists")
    public List<BorrowingRecordResponse> getBorrowLists() {
        return borrowingService.findBorrowingList();
    }

    // 予約リスト
    @GetMapping("/reservation-lists")
    public List<BookSearchResponse> getReservationLists() {
        return mstBookService.findReservedBooks()
                .stream()
                .map(this::toSearchResponse)
                .toList();
    }

    // 書籍登録
    @PostMapping
    public MstBook createBook(@RequestBody MstBook mstBook) {
        return mstBookService.create(mstBook);
    }

    private BookSearchResponse toSearchResponse(MstBook mstBook) {
        return BookSearchResponse.from(mstBook);
    }
}
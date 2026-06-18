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

import com.bold.application.dto.books.BookSearchRequest;
import com.bold.application.dto.books.BookSearchResponse;
import com.bold.application.entity.books.MstBook;
import com.bold.application.entity.books.TrnBookStatus;
import com.bold.application.repository.books.TrnBookStatusRepository;
import com.bold.application.service.books.MstBookService;

@RestController
@RequestMapping("/book")
@CrossOrigin(origins = "http://localhost:5173", methods = {
		RequestMethod.GET,
		RequestMethod.POST,
		RequestMethod.PUT,
		RequestMethod.DELETE,
		RequestMethod.OPTIONS
})
public class MstBookController {

	private final MstBookService mstBookService;
	private final TrnBookStatusRepository trnBookStatusRepository;

	public MstBookController(MstBookService mstBookService, TrnBookStatusRepository trnBookStatusRepository) {
		this.mstBookService = mstBookService;
		this.trnBookStatusRepository = trnBookStatusRepository;
	}

	@GetMapping("/search/all")
	public List<BookSearchResponse> getBooks() {
		return mstBookService.findAll()
				.stream()
				.map(this::toSearchResponse)
				.toList();
	}

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
				request.getLendStatus(),
				request.getStatus(),
				request.getRegion())
				.stream()
				.map(this::toSearchResponse)
				.toList();
	}

	@PostMapping
	public MstBook createBook(@RequestBody MstBook mstBook) {
		return mstBookService.create(mstBook);
	}

	private BookSearchResponse toSearchResponse(MstBook mstBook) {
		TrnBookStatus bookStatus = trnBookStatusRepository.findByBookId(mstBook.getBookId());
		return BookSearchResponse.from(
				mstBook,
				bookStatus != null ? bookStatus.getLendStatus() : null);
	}
}

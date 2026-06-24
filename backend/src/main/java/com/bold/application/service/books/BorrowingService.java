package com.bold.application.service.books;

import java.util.List;
import org.springframework.stereotype.Service;

import com.bold.application.dto.BorrowingRecordResponse;
import com.bold.application.entity.books.MstBook;
import com.bold.application.repository.books.MstBookRepository;
import com.bold.application.repository.users.UserRepository;

@Service
public class BorrowingService {

    private final MstBookRepository mstBookRepository;
    private final UserRepository userRepository;

    public BorrowingService(
            MstBookRepository mstBookRepository,
            UserRepository userRepository) {

        this.mstBookRepository = mstBookRepository;
        this.userRepository = userRepository;
    }

    public List<BorrowingRecordResponse> findBorrowingList() {

        List<MstBook> books =
                mstBookRepository.findByStatusIn(List.of("1", "2"));

        return books.stream()
                .map(book -> {

                    BorrowingRecordResponse response =
                            new BorrowingRecordResponse();

                    response.setTitle(book.getBookName());
                    response.setAuthor(book.getAuthorName());
                    response.setShelfNumber(book.getShelfNo());
                    response.setTierNumber(String.valueOf(book.getTierNo()));

                    response.setStatus(
                            "2".equals(book.getStatus())
                                    ? "返却申請中"
                                    : "貸出中");

                    if (book.getLendUserId() != null) {

                        userRepository.findById(book.getLendUserId())
                                .ifPresent(user -> {

                                    response.setEmployeeCode(
                                            user.getEmployeeCode());

                                    response.setBorrower(
                                            user.getUsername());
                                });
                    }

                    response.setLoanDate(
                            book.getStatusUpdatedAt() != null
                                    ? book.getStatusUpdatedAt()
                                            .toLocalDate()
                                            .toString()
                                    : "");

                    return response;
                })
                .toList();
    }
}

package com.bold.application.service.books;

import java.util.List;

import org.springframework.stereotype.Service;

import com.bold.application.dto.ReservationRecordResponse;
import com.bold.application.entity.books.MstBook;
import com.bold.application.repository.books.MstBookRepository;
import com.bold.application.repository.users.UserRepository;

@Service
public class ReservationService {

    private final MstBookRepository mstBookRepository;
    private final UserRepository userRepository;

    public ReservationService(
            MstBookRepository mstBookRepository,
            UserRepository userRepository
    ) {
        this.mstBookRepository = mstBookRepository;
        this.userRepository = userRepository;
    }

    public List<ReservationRecordResponse> findReservationList() {

        // 予約状態の本を取得（status = "1"）
        List<MstBook> books = mstBookRepository.findByStatus("1");

        return books.stream()
                .map(book -> {

                    ReservationRecordResponse response =
                            new ReservationRecordResponse();

                    response.setTitle(book.getBookName());
                    response.setAuthor(book.getAuthorName());
                    response.setShelfNumber(book.getShelfNo());
                    response.setTierNumber(String.valueOf(book.getTierNo()));

                    // 予約者（lendUserId を予約者として扱う）
                    if (book.getLendUserId() != null) {
                        userRepository.findById(book.getLendUserId())
                                .ifPresent(user -> {
                                    response.setReserver(user.getUsername());
                                });
                    }

                    // 予約日付（createdAt を予約日として扱う）
                    response.setReservationDate(
                            book.getCreatedAt() != null
                                    ? book.getCreatedAt().toLocalDate().toString()
                                    : ""
                    );

                    return response;
                })
                .toList();
    }
}

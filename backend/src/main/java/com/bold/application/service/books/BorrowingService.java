package com.bold.application.service.books;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.bold.application.dto.BorrowingRecordResponse;
import com.bold.application.entity.books.MstBook;
import com.bold.application.entity.books.MstBookLog;
import com.bold.application.entity.users.User;
import com.bold.application.repository.books.MstBookLogRepository;
import com.bold.application.repository.books.MstBookRepository;
import com.bold.application.repository.users.UserRepository;

@Service
public class BorrowingService {

    private final MstBookRepository mstBookRepository;
    private final UserRepository userRepository;
    private final MstBookLogRepository mstBookLogRepository;

    public BorrowingService(
            MstBookRepository mstBookRepository,
            UserRepository userRepository,
            MstBookLogRepository mstBookLogRepository) {

        this.mstBookRepository = mstBookRepository;
        this.userRepository = userRepository;
        this.mstBookLogRepository = mstBookLogRepository;
    }

    public List<BorrowingRecordResponse> findBorrowingList() {
        List<MstBook> books = mstBookRepository.findByStatusIn(List.of("1", "2"));

        return books.stream()
                .map(book -> {
                    BorrowingRecordResponse response = new BorrowingRecordResponse();
                    response.setBookId(book.getBookId());
                    response.setTitle(book.getBookName());
                    response.setAuthor(book.getAuthorName());
                    response.setShelfNumber(book.getShelfNo());
                    response.setTierNumber(String.valueOf(book.getTierNo()));
                    response.setStatus("2".equals(book.getStatus()) ? "返却申請中" : "貸出中");

                    if (book.getLendUserId() != null) {
                        userRepository.findById(book.getLendUserId())
                                .ifPresent(user -> {
                                    response.setEmployeeCode(user.getEmployeeCode());
                                    response.setBorrower(user.getUsername());
                                });
                    }
                    response.setLoanDate(book.getStatusUpdatedAt() != null 
                            ? book.getStatusUpdatedAt().toLocalDate().toString() : "");
                    return response;
                })
                .toList();
    }

    // 修正済みメソッド：Optionalで受け取ります
    public List<BorrowingRecordResponse> findHistoryByEmployeeCode(String employeeCode) {
        Optional<User> userOpt = userRepository.findByEmployeeCode(employeeCode);
        
        if (userOpt.isEmpty()) return List.of();
        
        User user = userOpt.get();

        List<MstBookLog> logs = mstBookLogRepository.findByLendUserId(user.getUserId());

        return logs.stream().map(log -> {
            BorrowingRecordResponse res = new BorrowingRecordResponse();
            res.setBookId(log.getBookId());
            res.setBorrower(user.getUsername());
            res.setEmployeeCode(user.getEmployeeCode());
            return res;
        }).collect(Collectors.toList());
    }
}
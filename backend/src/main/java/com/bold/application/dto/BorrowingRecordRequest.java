package com.bold.application.dto;

import java.util.List;

public class BorrowingRecordRequest {
    private List<BorrowingRecordResponse> records; // キー名（records）と一致させる

    // getter、setter
    public List<BorrowingRecordResponse> getRecords() { return records; }
    public void setRecords(List<BorrowingRecordResponse> values) { this.records = values; }

}

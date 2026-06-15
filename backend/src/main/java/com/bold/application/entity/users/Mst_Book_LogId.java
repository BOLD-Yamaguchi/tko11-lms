package com.bold.application.entity.users;

import java.io.Serializable;
import java.util.Objects;

public class Mst_Book_LogId implements Serializable {

    private Long lend_id;
    private Long book_id;

    // デフォルトコンストラクタ（必須）
    public Mst_Book_LogId() {}

    // コンストラクタ
    public Mst_Book_LogId(Long lend_id, Long book_id) {
        this.lend_id = lend_id;
        this.book_id = book_id;
    }

    // ゲッター・セッター
    public Long getLend_id() { return lend_id; }
    public void setLend_id(Long lend_id) { this.lend_id = lend_id; }
    public Long getBook_id() { return book_id; }
    public void setBook_id(Long book_id) { this.book_id = book_id; }

    // 複合キーが正しく比較されるために必須のメソッド（Eclipseの「Source」>「Generate hashCode() and equals()...」で自動生成できます）
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Mst_Book_LogId channels = (Mst_Book_LogId) o;
        return Objects.equals(lend_id, channels.lend_id) && Objects.equals(book_id, channels.book_id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(lend_id, book_id);
    }
}
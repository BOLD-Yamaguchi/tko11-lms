package com.bold.application.repository.users;

import static org.assertj.core.api.Assertions.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate; // ★追加
import org.springframework.transaction.annotation.Transactional;

import com.bold.application.entity.users.Mst_Book;

@SpringBootTest
@Transactional
public class Mst_BookRepositoryTest {

    @Autowired
    private JdbcTemplate jdbcTemplate; // ★追加

    @Autowired
    private Mst_BookRepository mstBookRepository;

    @Test
    public void 本マスタの保存と取得テスト() {
        // 1. 被らない適当な本のIDをその場で生成
        long randomBookId = System.currentTimeMillis() % 1000000L;
        
        // 2. 直接SQLを使って、手動で生成したIDを含めてインサートする！
        String sql = "INSERT INTO mst_book ("
                   + "  book_id, book_name, author_name, lend_status, publisher, region, "
                   + "  isbn, shelf_no, tier_no, published_at, created_at, updated_at"
                   + ") VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
                   
        jdbcTemplate.update(sql, 
            randomBookId, 
            "Java超入門", 
            "テスト著者", 
            0L, 
            "テスト出版社", 
            1L, 
            "978-4-00-000000-0", 
            "A-1", 
            1L, 
            LocalDate.now(),
            LocalDateTime.now(), 
            LocalDateTime.now()
        );

        // 3. データベースから、リポジトリ（JPA）経由でそのIDが検索できるか確認 (Readのテスト)
        Optional<Mst_Book> foundBookOpt = mstBookRepository.findById(randomBookId);
        
        // 4. 検証：意図したデータが取れているか
        assertThat(foundBookOpt).isPresent();
        assertThat(foundBookOpt.get().getBook_name()).isEqualTo("Java超入門");
        assertThat(foundBookOpt.get().getAuthor_name()).isEqualTo("テスト著者");
        assertThat(foundBookOpt.get().getBook_id()).isEqualTo(randomBookId);
    }
}
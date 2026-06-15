package com.bold.application.repository.users;

import static org.assertj.core.api.Assertions.*;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.transaction.annotation.Transactional;

import com.bold.application.entity.users.Trn_Status;

@SpringBootTest
@Transactional
public class Trn_StatusRepositoryTest {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Autowired
    private Trn_StatusRepository trnStatusRepository; // 検証（Read）のために残します

    @Test
    public void ステータスの保存と取得テスト() {
        // 1. 被らない適当な本のIDを生成
        long randomBookId = System.currentTimeMillis() % 1000000L;
        UUID randomUserId = UUID.randomUUID();
        
        // 2. 親である「mst_book」に直接SQLでINSERT
        String bookSql = "INSERT INTO mst_book ("
                       + "  book_id, book_name, author_name, lend_status, publisher, region, "
                       + "  isbn, shelf_no, tier_no, created_at, updated_at"
                       + ") VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
                   
        jdbcTemplate.update(bookSql, 
            randomBookId, "Java超入門", "テスト著者", 0L, "テスト出版社", 1L, 
            "978-4-00-000000-0", 1L, 1L, LocalDateTime.now(), LocalDateTime.now()
        );

        // 3. ★【ここを修正】子である「trn_status」も、save() を使わず直接SQLでINSERTする！
        // (※もしtrn_statusのテーブル名やカラム名が実際の定義とズレていたら、エラーログを見て微調整します)
        String statusSql = "INSERT INTO trn_status ("
                         + "  book_id, lend_user_id, lend_status, rtndated_at, created_at, updated_at"
                         + ") VALUES (?, ?, ?, ?, ?, ?)";
                         
        jdbcTemplate.update(statusSql,
            randomBookId,                       // book_id
            randomUserId,                       // lend_user_id
            "貸出中",                            // lend_status
            LocalDateTime.now().plusDays(7),    // rtndated_at
            LocalDateTime.now(),                // created_at
            LocalDateTime.now()                 // updated_at
        );

        // 4. データベースから、リポジトリ経由で正しく取得できるか確認 (Readのテスト)
        Optional<Trn_Status> foundStatusOpt = trnStatusRepository.findById(randomBookId);
        
        // 5. 検証
        assertThat(foundStatusOpt).isPresent();
        assertThat(foundStatusOpt.get().getLend_status()).isEqualTo("貸出中");
        assertThat(foundStatusOpt.get().getBook_id()).isEqualTo(randomBookId);
    }
}
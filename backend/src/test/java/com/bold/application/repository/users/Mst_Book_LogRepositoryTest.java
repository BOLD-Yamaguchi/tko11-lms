package com.bold.application.repository.users;

import static org.assertj.core.api.Assertions.*;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;
//import org.springframework.transaction.annotation.Transactional;

import com.bold.application.entity.users.Mst_Book_Log;
import com.bold.application.entity.users.Mst_Book_LogId; // ★複合キーのクラスをインポート

@SpringBootTest
//@Transactional
public class Mst_Book_LogRepositoryTest {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Autowired
    private Mst_Book_LogRepository mstBookLogRepository;

    @Test
    public void ブックログの保存と取得テスト() {

        // 1. 被らない適当なID群とUUIDを生成
        long randomLendId = System.currentTimeMillis() % 1000000L;
        long randomBookId = (System.currentTimeMillis() + 1) % 1000000L;
        UUID randomUserId = UUID.randomUUID();

        // 2. 先に mst_book にデータを入れる（外部キー対策）
        jdbcTemplate.update(
                "INSERT INTO mst_book (book_id, book_name, author_name, lend_status, publisher, region, shelf_no, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
                randomBookId,
                "テスト用の本",
                "テスト用の本の作者",
                1,
                "集英社",
                0,
                1,
                LocalDateTime.now(),
                LocalDateTime.now()
            );
   
        // 3. mst_book_log に INSERT
        String sql = "INSERT INTO mst_book_log ("
                   + "  lend_id, book_id, lend_user_id, statement, hidden_flg, created_at, updated_at"
                   + ") VALUES (?, ?, ?, ?, ?, ?, ?)";
                   
        jdbcTemplate.update(sql, 
            randomLendId, 
            randomBookId, 
            randomUserId, 
            "貸出ログテスト文面", // statement
            "0",                // hidden_flg (String型なので文字列)
            LocalDateTime.now(), 
            LocalDateTime.now()
        );

        // 4. ★【複合キーの検索対策】IdClassである Mst_Book_LogId のインスタンスを作成して検索する
        Mst_Book_LogId id = new Mst_Book_LogId();
        // ※ Mst_Book_LogId クラス内のセッター名（またはフィールド名）に合わせてセットします
        // もしコンパイルエラー（赤線）が出たら、Mst_Book_LogId クラスの定義に合わせて調整してください
        id.setLend_id(randomLendId);
        id.setBook_id(randomBookId);

        Optional<Mst_Book_Log> foundLogOpt = mstBookLogRepository.findById(id);
        
        // 5. 検証
        assertThat(foundLogOpt).isPresent();
        assertThat(foundLogOpt.get().getStatement()).isEqualTo("貸出ログテスト文面");
        assertThat(foundLogOpt.get().getLend_id()).isEqualTo(randomLendId);
        assertThat(foundLogOpt.get().getBook_id()).isEqualTo(randomBookId);
    }
}
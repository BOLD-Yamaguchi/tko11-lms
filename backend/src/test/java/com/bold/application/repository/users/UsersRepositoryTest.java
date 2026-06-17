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

import com.bold.application.entity.users.User;

@SpringBootTest
@Transactional
public class UsersRepositoryTest {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Autowired
    private UserRepository userRepository; 

    @Test
    public void ユーザーの保存と取得テスト() {
        // 1. 被らないランダムなUUIDを生成
        UUID randomUserId = UUID.randomUUID();
        
        // 2. ★DBの定義に合わせて「affiliation_kbn」に修正！
        // さらに、Failing rowの末尾にあった怪しいカラム位置を埋めるため、
        // もし他にも必須カラム（例: delete_flg 等）があればここで追加できるように想定。
        // 一ったん、エラーの出た区分値を正しくインサートします。
        String sql = "INSERT INTO users ("
                   + "  user_id, username, mail_address, password, employee_code, "
                   + "  affiliation_kbn, admin_kbn, created_at, updated_at"
                   + ") VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
                   
        jdbcTemplate.update(sql, 
            randomUserId, 
            "テスト太郎", 
            "test_user@example.com", 
            "hashed_password_123", 
            "EMP0001", 
            1L,                    // affiliation_kbn (スペル修正版に 1L をセット)
            0L,                    // admin_kbn
            LocalDateTime.now(), 
            LocalDateTime.now()
        );

        // 3. データベースからリポジトリ経由で検索userRepositoryTest
        // 修正：Optional<User> の閉じカッコを追加、リポジトリの変数名を修正
        Optional<User> foundUserOpt = userRepository.findById(randomUserId);
        
        // 4. 検証
        assertThat(foundUserOpt).isPresent();
        assertThat(foundUserOpt.get().getUsername()).isEqualTo("テスト太郎");
        // 修正：UserControllerの記述「getMailAddress()」「getUserId()」に合わせてキャメルケースのメソッド名に修正
        assertThat(foundUserOpt.get().getMailAddress()).isEqualTo("test_user@example.com");
        assertThat(foundUserOpt.get().getUserId()).isEqualTo(randomUserId);
    }
}
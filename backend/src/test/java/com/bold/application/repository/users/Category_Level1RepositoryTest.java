package com.bold.application.repository.users;

// ★変更点2: assertThat を使うためのインポート（コメントアウトを外しました）
import static org.assertj.core.api.Assertions.*;

import java.time.LocalDateTime;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
// ★変更点1: @SpringBootTest を使うためのインポート
import org.springframework.boot.test.context.SpringBootTest;

import com.bold.application.entity.users.Category_Level1;

@SpringBootTest // ★変更点3: 最新環境で確実に動く @SpringBootTest に変更しました
public class Category_Level1RepositoryTest {

    @Autowired
    private Category_Level1Repository categoryLevel1Repository;

    @Test
    public void 保存して取得するテスト() {
        // 1. テストデータの作成 (Create)
        Category_Level1 category = new Category_Level1();
        category.setCategory_Level1_name("技術書");
        category.setCreated_at(LocalDateTime.now());
        category.setUpdated_at(LocalDateTime.now());

        // 2. データベースへ保存 (Write)
        Category_Level1 savedCategory = categoryLevel1Repository.save(category);

        // 3. 保存されたかチェック
        assertThat(savedCategory.getCategory_Level1_id()).isNotNull(); // IDが自動採番されているか

        // 4. データベースからIDで検索 (Read)
        Optional<Category_Level1> foundCategoryOpt = categoryLevel1Repository.findById(savedCategory.getCategory_Level1_id());
        
        // 5. 検証（無事に取得できて、名前が一致するか）
        assertThat(foundCategoryOpt).isPresent();
        assertThat(foundCategoryOpt.get().getCategory_Level1_name()).isEqualTo("技術書");
    }
}
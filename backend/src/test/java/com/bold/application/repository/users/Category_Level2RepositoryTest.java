package com.bold.application.repository.users;

import static org.assertj.core.api.Assertions.*;

import java.time.LocalDateTime;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.bold.application.entity.users.Category_Level1;
import com.bold.application.entity.users.Category_Level2;

@SpringBootTest
public class Category_Level2RepositoryTest {

    @Autowired
    private Category_Level1Repository categoryLevel1Repository;

    @Autowired
    private Category_Level2Repository categoryLevel2Repository;

    @Test
    public void 中カテゴリの保存と取得テスト() {
        // 1. 親となる「大カテゴリ（Level1）」をまず作って保存する
        Category_Level1 level1 = new Category_Level1();
        level1.setCategory_Level1_name("技術書");
        level1.setCreated_at(LocalDateTime.now());
        level1.setUpdated_at(LocalDateTime.now());
        Category_Level1 savedLevel1 = categoryLevel1Repository.save(level1);

        // 2. 本題の「中カテゴリ（Level2）」を作成し、親のIDをセットする
        Category_Level2 level2 = new Category_Level2();
        level2.setCategory_Level2_name("Java");
        level2.setParent_category(savedLevel1.getCategory_Level1_id()); // ★ここで合体！
        level2.setCreated_at(LocalDateTime.now());
        level2.setUpdated_at(LocalDateTime.now());

        // 3. データベースへ保存 (Write)
        Category_Level2 savedLevel2 = categoryLevel2Repository.save(level2);

        // 4. 保存されたかチェック
        assertThat(savedLevel2.getCategory_Level2_id()).isNotNull();

        // 5. データベースからIDで検索 (Read)
        Optional<Category_Level2> foundLevel2Opt = categoryLevel2Repository.findById(savedLevel2.getCategory_Level2_id());
        
        // 6. 検証（無事に取得できて、名前や親IDが一致するか）
        assertThat(foundLevel2Opt).isPresent();
        assertThat(foundLevel2Opt.get().getCategory_Level2_name()).isEqualTo("Java");
        assertThat(foundLevel2Opt.get().getParent_category()).isEqualTo(savedLevel1.getCategory_Level1_id());
    }
}
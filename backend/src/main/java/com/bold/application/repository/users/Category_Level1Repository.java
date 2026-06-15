package com.bold.application.repository.users;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.bold.application.entity.users.Category_Level1;

@Repository
public interface Category_Level1Repository
    extends JpaRepository<Category_Level1, Long> {

}

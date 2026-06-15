package com.bold.application.repository.users;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.bold.application.entity.users.Category_Level2;

@Repository
public interface Category_Level2Repository 
    extends JpaRepository<Category_Level2, Long> {

}

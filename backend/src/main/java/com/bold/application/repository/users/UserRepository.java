package com.bold.application.repository.users;

import org.springframework.data.jpa.repository.JpaRepository;
import com.bold.application.entity.users.User;

public interface UserRepository
        extends JpaRepository<User, Long> {
}
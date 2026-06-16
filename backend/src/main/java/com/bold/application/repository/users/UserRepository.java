package com.bold.application.repository.users;

import org.springframework.data.jpa.repository.JpaRepository;
import com.bold.application.entity.users.User;
import java.util.Optional;

public interface UserRepository
        extends JpaRepository<User, String> {
                Optional<User> findByMailAddress(String mailAddress);
}
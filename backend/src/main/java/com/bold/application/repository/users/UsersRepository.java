package com.bold.application.repository.users;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.bold.application.entity.users.Users;

@Repository
public interface UsersRepository
    extends JpaRepository<Users, UUID> {
}

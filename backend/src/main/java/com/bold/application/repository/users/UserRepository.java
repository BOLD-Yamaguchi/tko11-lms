package com.bold.application.repository.users;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.bold.application.entity.users.User;


@Repository
public interface UserRepository extends JpaRepository<User, UUID> {

    // ログイン用
    Optional<User> findByEmployeeCode(String employeeCode);

    // 検索用
    Optional<User> findByMailAddress(String mailAddress);

    // 重複チェック用
    boolean existsByMailAddress(String mailAddress);
    boolean existsByEmployeeCode(String employeeCode);

    List<User> findByUserIdIn(List<UUID> userIds);

}


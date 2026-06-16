package com.bold.application.repository.users;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.bold.application.entity.users.User;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {


Optional<User> findByMailAddress(String mailAddress);

boolean existsByMailAddress(String mailAddress);

boolean existsByEmployeeCode(String employeeCode);


}
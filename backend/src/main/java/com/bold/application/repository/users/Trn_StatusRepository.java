package com.bold.application.repository.users;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.bold.application.entity.users.Trn_Status;

@Repository
public interface Trn_StatusRepository
    extends JpaRepository<Trn_Status, Long> {

}

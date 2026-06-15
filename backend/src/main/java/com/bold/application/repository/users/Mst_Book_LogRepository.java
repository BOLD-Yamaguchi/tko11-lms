package com.bold.application.repository.users;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.bold.application.entity.users.Mst_Book_Log;
import com.bold.application.entity.users.Mst_Book_LogId;

@Repository
public interface Mst_Book_LogRepository
    extends JpaRepository<Mst_Book_Log, Mst_Book_LogId> {

}

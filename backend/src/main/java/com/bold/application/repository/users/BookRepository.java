<<<<<<<< HEAD:backend/src/main/java/com/bold/application/controller/users/repository/BookRepository.java
package com.example.demo.repository;
========
package com.bold.application.repository.users;
>>>>>>>> main:backend/src/main/java/com/bold/application/repository/users/BookRepository.java

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

<<<<<<<< HEAD:backend/src/main/java/com/bold/application/controller/users/repository/BookRepository.java
import com.example.demo.entity.Book;
========
import com.bold.application.entity.users.Book;
>>>>>>>> main:backend/src/main/java/com/bold/application/repository/users/BookRepository.java

@Repository
public interface BookRepository extends JpaRepository<Book, Long> {
}

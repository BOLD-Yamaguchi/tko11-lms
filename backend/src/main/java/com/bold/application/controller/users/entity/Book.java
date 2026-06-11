<<<<<<<< HEAD:backend/src/main/java/com/bold/application/controller/users/entity/Book.java
package com.example.demo.entity;
========
package com.bold.application.entity.users;
>>>>>>>> main:backend/src/main/java/com/bold/application/entity/users/Book.java

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "books")
public class Book {

	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    public Long getId() {
        return id;
    }

	public void setId(Long id) {
		this.id = id;
	}

	public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }
}

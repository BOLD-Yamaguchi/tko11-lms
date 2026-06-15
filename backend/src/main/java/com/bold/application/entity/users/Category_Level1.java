package com.bold.application.entity.users;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "category_Level1")

public class Category_Level1 {

	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    private Long category_Level1_id;

	private String category_Level1_name;

	private LocalDateTime created_at;
	
    private LocalDateTime updated_at;

	public Long getCategory_Level1_id() {
		return category_Level1_id;
	}

	public void setCategory_Level1_id(Long category_Level1_id) {
		this.category_Level1_id = category_Level1_id;
	}

	public String getCategory_Level1_name() {
		return category_Level1_name;
	}

	public void setCategory_Level1_name(String category_Level1_name) {
		this.category_Level1_name = category_Level1_name;
	}

	public LocalDateTime getCreated_at() {
		return created_at;
	}

	public void setCreated_at(LocalDateTime created_at) {
		this.created_at = created_at;
	}

	public LocalDateTime getUpdated_at() {
		return updated_at;
	}

	public void setUpdated_at(LocalDateTime updated_at) {
		this.updated_at = updated_at;
	}

}

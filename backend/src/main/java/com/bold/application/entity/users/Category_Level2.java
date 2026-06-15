package com.bold.application.entity.users;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "category_Level2")

public class Category_Level2 {

	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    private Long category_Level2_id;

	private String category_Level2_name;

    private Long parent_category;

    private LocalDateTime created_at;
	
    private LocalDateTime updated_at;

	public Long getCategory_Level2_id() {
		return category_Level2_id;
	}

	public void setCategory_Level2_id(Long category_Level2_id) {
		this.category_Level2_id = category_Level2_id;
	}

	public String getCategory_Level2_name() {
		return category_Level2_name;
	}

	public void setCategory_Level2_name(String category_Level2_name) {
		this.category_Level2_name = category_Level2_name;
	}

	public Long getParent_category() {
		return parent_category;
	}

	public void setParent_category(Long parent_category) {
		this.parent_category = parent_category;
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

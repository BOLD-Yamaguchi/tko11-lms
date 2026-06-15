package com.bold.application.entity.books;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "mst_category_level1")
public class Mst_category_level2{

	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int category_level2_id;
    private String category_level2_name;
    private LocalDateTime created_at;
    private LocalDateTime updated_at;

    public int getCategory_level2_id() {
        return category_level2_id;
    }

	public void setCategory_level2_id(int category_level2_id) {
		this.category_level2_id = category_level2_id;
	}

    public String getCategory_level2_name() {
        return category_level2_name;
    }

	public void setCategory_level2_name(String category_level2_name) {
		this.category_level2_name = category_level2_name;
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

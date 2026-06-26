package com.bold.application.entity.books;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "mst_category_level2")
public class MstCategoryLevel2{

	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int categoryLevel2Id;

    private String categoryLevel2Name;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public Integer getCategoryLevel2Id() {
        return categoryLevel2Id;
    }

	public void setCategoryLevel2Id(Integer categoryLevel2Id) {
		this.categoryLevel2Id = categoryLevel2Id;
	}

    public String getCategoryLevel2Name() {
        return categoryLevel2Name;
    }

	public void setCategoryLevel2Name(String categoryLevel2Name) {
		this.categoryLevel2Name = categoryLevel2Name;
	}

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}

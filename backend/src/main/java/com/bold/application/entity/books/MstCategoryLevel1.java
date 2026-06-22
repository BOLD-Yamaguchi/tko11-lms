package com.bold.application.entity.books;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;

@Entity
@Table(name = "mst_category_level1")
public class MstCategoryLevel1{

	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int categoryLevel1Id;

	@NotBlank
	@Column(nullable = false, length = 100)
    private String categoryLevel1Name;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public int getCategoryLevel1Id() {
        return categoryLevel1Id;
    }

	public void setCategoryLevel1Id(int categoryLevel1Id) {
		this.categoryLevel1Id = categoryLevel1Id;
	}

    public String getCategoryLevel1Name() {
        return categoryLevel1Name;
    }

	public void setCategoryLevel1Name(String categoryLevel1Name) {
		this.categoryLevel1Name = categoryLevel1Name;
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

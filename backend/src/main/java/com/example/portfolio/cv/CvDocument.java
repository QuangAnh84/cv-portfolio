package com.example.portfolio.cv;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.Table;
import java.time.Instant;

@Entity
@Table(name = "cv_document")
public class CvDocument {
  @Id
  private Long id;

  @Lob
  @Column(name = "data_json", nullable = false, columnDefinition = "CLOB")
  private String dataJson;

  @Column(name = "updated_at", nullable = false)
  private Instant updatedAt;

  protected CvDocument() {}

  public CvDocument(Long id, String dataJson, Instant updatedAt) {
    this.id = id;
    this.dataJson = dataJson;
    this.updatedAt = updatedAt;
  }

  public Long getId() {
    return id;
  }

  public String getDataJson() {
    return dataJson;
  }

  public void setDataJson(String dataJson) {
    this.dataJson = dataJson;
  }

  public Instant getUpdatedAt() {
    return updatedAt;
  }

  public void setUpdatedAt(Instant updatedAt) {
    this.updatedAt = updatedAt;
  }
}


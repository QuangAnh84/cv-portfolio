package com.example.portfolio.cv;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.time.Instant;
import java.util.Optional;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CvService {
  public static final long CV_ID = 1L;

  private final CvDocumentRepository repository;
  private final ObjectMapper objectMapper;

  public CvService(CvDocumentRepository repository, ObjectMapper objectMapper) {
    this.repository = repository;
    this.objectMapper = objectMapper;
  }

  @Transactional(readOnly = true)
  public JsonNode getCv() {
    Optional<CvDocument> existing = repository.findById(CV_ID);
    if (existing.isPresent()) {
      return parse(existing.get().getDataJson());
    }
    return defaultCv();
  }

  @Transactional
  public JsonNode saveCv(JsonNode cv) {
    String json = write(cv);
    CvDocument doc =
        repository
            .findById(CV_ID)
            .orElseGet(() -> new CvDocument(CV_ID, json, Instant.EPOCH));
    doc.setDataJson(json);
    doc.setUpdatedAt(Instant.now());
    repository.save(doc);
    return cv;
  }

  private JsonNode parse(String json) {
    try {
      return objectMapper.readTree(json);
    } catch (Exception e) {
      return defaultCv();
    }
  }

  private String write(JsonNode node) {
    try {
      return objectMapper.writeValueAsString(node);
    } catch (Exception e) {
      throw new IllegalArgumentException("Invalid CV JSON", e);
    }
  }

  private JsonNode defaultCv() {
    String seed =
        """
        {
          "profile": {
            "fullName": "Jane Doe",
            "headline": "Designer",
            "location": "London, UK",
            "email": "ex@mail.com",
            "phone": "1224435534",
            "avatarUrl": "https://www.w3schools.com/w3images/avatar_hat.jpg"
          },
          "skills": [
            { "name": "Adobe Photoshop", "percent": 90 },
            { "name": "Photography", "percent": 80 },
            { "name": "Illustrator", "percent": 75 },
            { "name": "Media", "percent": 50 }
          ],
          "languages": [
            { "name": "English", "percent": 100 },
            { "name": "Spanish", "percent": 55 },
            { "name": "German", "percent": 25 }
          ],
          "workExperience": [
            {
              "title": "Front End Developer",
              "company": "w3schools.com",
              "from": "Jan 2015",
              "to": "Current",
              "details": "Lorem ipsum dolor sit amet. Praesentium magnam consectetur vel in deserunt aspernatur est reprehenderit sunt hic. Nulla tempora soluta ea et odio, unde doloremque repellendus iure, iste."
            },
            {
              "title": "Web Developer",
              "company": "something.com",
              "from": "Mar 2012",
              "to": "Dec 2014",
              "details": "Consectetur adipisicing elit. Praesentium magnam consectetur vel in deserunt aspernatur est reprehenderit sunt hic. Nulla tempora soluta ea et odio, unde doloremque repellendus iure, iste."
            },
            {
              "title": "Graphic Designer",
              "company": "designsomething.com",
              "from": "Jun 2010",
              "to": "Mar 2012",
              "details": "Lorem ipsum dolor sit amet, consectetur adipisicing elit."
            }
          ],
          "education": [
            {
              "school": "W3Schools.com",
              "from": "Forever",
              "to": "",
              "details": "Web Development! All I need to know in one place"
            },
            {
              "school": "London Business School",
              "from": "2013",
              "to": "2015",
              "details": "Master Degree"
            },
            {
              "school": "School of Coding",
              "from": "2010",
              "to": "2013",
              "details": "Bachelor Degree"
            }
          ],
          "social": {
            "twitter": "",
            "linkedin": "",
            "github": ""
          }
        }
        """;
    return parse(seed);
  }
}


package com.example.portfolio.cv;

import com.fasterxml.jackson.databind.JsonNode;
import jakarta.validation.Valid;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(path = "/api", produces = MediaType.APPLICATION_JSON_VALUE)
public class CvController {
  private final CvService cvService;

  public CvController(CvService cvService) {
    this.cvService = cvService;
  }

  @GetMapping("/cv")
  public JsonNode getCv() {
    return cvService.getCv();
  }

  @PutMapping("/admin/cv")
  public JsonNode updateCv(@Valid @RequestBody JsonNode cv) {
    return cvService.saveCv(cv);
  }
}


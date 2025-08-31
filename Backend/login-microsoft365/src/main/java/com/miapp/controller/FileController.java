package com.miapp.controller;

import com.miapp.service.FileStorageService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.core.io.Resource;

@RestController
@RequestMapping("/files")
public class FileController {
//    private final FileStorageService storage;
//    public FileController(FileStorageService storage){ this.storage = storage; }

//    @GetMapping("/{filename:.+}")
//    public ResponseEntity<Resource> serve(@PathVariable String filename) {
//        Resource file = storage.loadAsResource(filename);
//        return ResponseEntity.ok()
//                .header(HttpHeaders.CONTENT_DISPOSITION,
//                        "inline; filename=\"" + file.getFilename() + "\"")
//                .body(file);
//    }
}
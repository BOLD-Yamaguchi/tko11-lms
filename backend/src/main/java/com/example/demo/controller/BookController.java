package com.example.demo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.entity.Book;
import com.example.demo.repository.BookRepository;

@RestController
@RequestMapping("/books")
@CrossOrigin(origins = "http://localhost:5173", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS}) // Reactからのアクセスを許可
public class BookController {

    @Autowired
    private BookRepository repository;

    @GetMapping
    public List<Book> getBooks() {
        return repository.findAll();
    }

    @PostMapping
    public Book createBooks(@RequestBody Book book) {
        return repository.save(book);
    }

    @DeleteMapping("/{id}")
    @ResponseBody
    public ResponseEntity<Void> deleteBooks(@PathVariable Long id) {
        if (!repository.existsById(id)) {
            return ResponseEntity.notFound().build(); // データがない場合は404
        }
        repository.deleteById(id); // PostgreSQLから物理削除
        return ResponseEntity.noContent().build(); // 成功時は204
    }
/*    public Book deleteItem(@PathVariable Long id) {
    if (!repository.existsById(id)) {
        return new Book();
    }
    repository.deleteById(id); // PostgreSQLから物理削除
    //return Map.of("status", "deleted", "id", id.toString());
    return new Book();
}*/
/*    public ResponseEntity<?> deleteItem(@PathVariable Long id) {
        if (!repository.existsById(id)) {
            String reason =  "no reason";
            return ResponseEntity.ok(Map.of(
                    "status", "ng",
                    "id", id.toString(),
                    "reason", reason
                ));
        }
        repository.deleteById(id); // PostgreSQLから物理削除
        String reason =  "no reason";
        return ResponseEntity.ok(Map.of(
                "status", "ok",
                "id", id.toString(),
                "reason", reason
            ));
        //return ResponseEntity.ok(Map.of("status", "deleted"));
    }*/
}

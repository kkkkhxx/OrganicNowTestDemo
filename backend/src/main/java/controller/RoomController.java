package com.organicnow.backend.controller;

import com.organicnow.backend.model.Room;
import com.organicnow.backend.service.RoomService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rooms")
public class RoomController {
    private final RoomService service;

    public RoomController(RoomService service) {
        this.service = service;
    }

    @GetMapping
    public List<Room> all() { return service.findAll(); }

    @GetMapping("/{id}")
    public Room one(@PathVariable Long id) { return service.findById(id); }

    @PostMapping
    public Room create(@Valid @RequestBody Room room) { return service.create(room); }

    @PutMapping("/{id}")
    public Room update(@PathVariable Long id, @Valid @RequestBody Room room) {
        return service.update(id, room);
    }

    @DeleteMapping("/{id}")
    public void remove(@PathVariable Long id) { service.delete(id); }
}

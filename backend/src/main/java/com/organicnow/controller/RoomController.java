package com.organicnow.controller;

import com.organicnow.model.Room;
import com.organicnow.service.RoomService;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/rooms")
@CrossOrigin(origins = "http://localhost:5173") // อนุญาต frontend
public class RoomController {

    private final RoomService roomService;

    public RoomController(RoomService roomService) {
        this.roomService = roomService;
    }

    // ✅ GET All Rooms
    @GetMapping
    public Map<String, Object> getAllRooms() {
        List<Room> rooms = roomService.getAllRooms();
        Map<String, Object> response = new HashMap<>();
        response.put("result", rooms);
        return response;
    }

    // ✅ GET Room by ID
    @GetMapping("/{id}")
    public Map<String, Object> getRoomById(@PathVariable Long id) {
        Room room = roomService.getRoomById(id);
        Map<String, Object> response = new HashMap<>();
        response.put("result", room);
        return response;
    }

    // ✅ POST Create Room
    @PostMapping
    public Map<String, Object> createRoom(@RequestBody Room room) {
        Room savedRoom = roomService.saveRoom(room);
        Map<String, Object> response = new HashMap<>();
        response.put("result", savedRoom);
        return response;
    }

    // ✅ DELETE Room
    @DeleteMapping("/{id}")
    public Map<String, Object> deleteRoom(@PathVariable Long id) {
        roomService.deleteRoom(id);
        Map<String, Object> response = new HashMap<>();
        response.put("result", "Room with ID " + id + " deleted successfully");
        return response;
    }
}

package com.organicnow.backend.service;

import com.organicnow.backend.model.Room;
import com.organicnow.backend.repository.RoomRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RoomService {
    private final RoomRepository repo;

    public RoomService(RoomRepository repo) {
        this.repo = repo;
    }

    public List<Room> findAll() { return repo.findAll(); }

    public Room findById(Long id) {
        return repo.findById(id).orElseThrow(() -> new RuntimeException("Room not found"));
    }

    public Room create(Room input) {
        if (repo.existsByRoomNumber(input.getRoomNumber())) {
            throw new RuntimeException("Room number already exists");
        }
        return repo.save(input);
    }

    public Room update(Long id, Room input) {
        Room r = findById(id);
        // ถ้าเปลี่ยนเลขห้อง ต้องเช็คซ้ำ
        if (!r.getRoomNumber().equals(input.getRoomNumber())
                && repo.existsByRoomNumber(input.getRoomNumber())) {
            throw new RuntimeException("Room number already exists");
        }
        r.setRoomNumber(input.getRoomNumber());
        r.setRoomFloor(input.getRoomFloor());
        return repo.save(r);
    }

    public void delete(Long id) { repo.deleteById(id); }
}

package com.organicnow.backend.service;

import com.organicnow.backend.model.Room;
import java.util.List;

public interface RoomService {
    List<Room> getAllRooms();
    Room getRoomById(Long id);
    Room saveRoom(Room room);
    void deleteRoom(Long id);
}

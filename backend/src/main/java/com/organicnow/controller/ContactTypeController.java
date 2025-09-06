package com.organicnow.backend.controller;

import com.organicnow.backend.model.ContractType;
import com.organicnow.backend.service.ContactTypeService;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/contact-types")
@CrossOrigin(origins = "http://localhost:5173")
public class ContactTypeController {

    private final ContactTypeService contactTypeService;

    public ContactTypeController(ContactTypeService contactTypeService) {
        this.contactTypeService = contactTypeService;
    }

    @GetMapping
    public Map<String, Object> getAllContactTypes() {
        return contactTypeService.getAllContactTypes();
    }

    @GetMapping("/{id}")
    public Map<String, Object> getContactTypeById(@PathVariable Long id) {
        return contactTypeService.getContactTypeById(id);
    }

    @PostMapping
    public Map<String, Object> createContactType(@RequestBody ContractType contractType) {
        return contactTypeService.createContactType(contractType);
    }

    @DeleteMapping("/{id}")
    public Map<String, Object> deleteContactType(@PathVariable Long id) {
        return contactTypeService.deleteContactType(id);
    }
}

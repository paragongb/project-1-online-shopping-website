package com.paragon.project1.web.rest;

import com.paragon.project1.security.AuthoritiesConstants;
import com.paragon.project1.service.AdminDashboardService;
import com.paragon.project1.service.dto.AdminDashboardStats;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/** REST endpoint for administrator-only business statistics. */
@RestController
@RequestMapping("/api/admin/dashboard")
@PreAuthorize("hasAuthority(\"" + AuthoritiesConstants.ADMIN + "\")")
public class AdminDashboardResource {

    private final AdminDashboardService adminDashboardService;

    public AdminDashboardResource(AdminDashboardService adminDashboardService) {
        this.adminDashboardService = adminDashboardService;
    }

    @GetMapping
    public ResponseEntity<AdminDashboardStats> getDashboardStats() {
        return ResponseEntity.ok(adminDashboardService.getDashboardStats());
    }
}

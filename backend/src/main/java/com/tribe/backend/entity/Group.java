package com.tribe.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "groups")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Group {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String platformGroupId;

    @Column(nullable = false)
    private Integer totalAmount; // in paise

    @Column(nullable = false)
    private Integer memberCount;

    @Column(nullable = false)
    private String currency;

    @Column(nullable = false)
    private String status;

    private LocalDateTime createdAt;
}
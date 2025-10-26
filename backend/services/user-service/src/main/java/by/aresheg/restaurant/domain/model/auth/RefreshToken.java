package by.aresheg.restaurant.domain.model.auth;

import by.aresheg.restaurant.domain.model.user.User;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "refresh_token", schema = "user_schema")
public class RefreshToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String tokenHash;

    @CreationTimestamp
    @Column(nullable = false)
    private Instant issuedAt;

    @Column(nullable = false)
    private Instant expiresAt;

    private Instant validatedAt;

    private Boolean revoked = false;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

}

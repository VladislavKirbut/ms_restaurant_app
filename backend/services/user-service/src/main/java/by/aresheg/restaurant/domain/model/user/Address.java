package by.aresheg.restaurant.domain.model.user;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "address", schema = "user_schema")
public class Address {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String street;

    private String city;

    private String zip;

    private String state;

    private String country;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

}

package personal.projects.TopShop.service.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import personal.projects.TopShop.domaine.product.ProductVo;

import java.util.Date;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
@Entity
public class ProductReview {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne
    private Product product;
    @ManyToOne
    private Client user;
    @Temporal(value = TemporalType.TIMESTAMP)
    private Date createdAt;
    private Double rating;
    private String header;
    @Column(columnDefinition = "TEXT")
    private String comment;


}

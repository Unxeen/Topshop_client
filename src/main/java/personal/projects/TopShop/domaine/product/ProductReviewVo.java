package personal.projects.TopShop.domaine.product;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import personal.projects.TopShop.domaine.client.ClientVo;
import personal.projects.TopShop.service.models.Client;
import personal.projects.TopShop.service.models.Product;

import java.util.Date;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class ProductReviewVo {

    private Long id;
    private ProductVo product;
    private ClientVo user;
    private String createdAt;
    private Double rating;
    private String header;
    private String comment;

}

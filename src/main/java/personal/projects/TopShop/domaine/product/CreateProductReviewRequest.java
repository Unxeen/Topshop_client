package personal.projects.TopShop.domaine.product;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class CreateProductReviewRequest {

    private Long productId;
    private String username;
    private Double rating;
    private String header;
    private String comment;

}

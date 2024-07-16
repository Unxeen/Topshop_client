package personal.projects.TopShop.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import personal.projects.TopShop.service.models.ProductReview;

import java.util.List;

public interface ProductReviewRepository extends JpaRepository<ProductReview, Long> {

    List<ProductReview> findAllByProduct_Id(Long id);

}

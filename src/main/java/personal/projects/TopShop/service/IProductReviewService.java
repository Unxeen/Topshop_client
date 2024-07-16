package personal.projects.TopShop.service;

import personal.projects.TopShop.domaine.product.CreateProductReviewRequest;
import personal.projects.TopShop.domaine.product.ProductReviewVo;
import personal.projects.TopShop.service.models.ProductReview;

import java.util.List;

public interface IProductReviewService {

    String addReview(CreateProductReviewRequest request);
    List<ProductReviewVo> getProductReviews(Long id);
}

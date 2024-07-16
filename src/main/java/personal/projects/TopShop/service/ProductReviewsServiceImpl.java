package personal.projects.TopShop.service;

import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.hibernate.annotations.SecondaryRow;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import personal.projects.TopShop.dao.ClientRepository;
import personal.projects.TopShop.dao.ProductRepository;
import personal.projects.TopShop.dao.ProductReviewRepository;
import personal.projects.TopShop.domaine.product.CreateProductReviewRequest;
import personal.projects.TopShop.domaine.product.ProductReviewVo;
import personal.projects.TopShop.service.exception.BusinessException;
import personal.projects.TopShop.service.models.Client;
import personal.projects.TopShop.service.models.Product;
import personal.projects.TopShop.service.models.ProductReview;

import java.time.Instant;
import java.util.Date;
import java.util.List;

@Service
@AllArgsConstructor
@Transactional
public class ProductReviewsServiceImpl implements IProductReviewService{

    private ProductReviewRepository productReviewRepository;
    private ClientRepository clientRepository;
    private ProductRepository productRepository;
    private ModelMapper modelMapper;


    @Override
    public String addReview(CreateProductReviewRequest request) {

        Client client = clientRepository.findByUsername(request.getUsername()).orElseThrow(
                () -> new BusinessException(String.format("No client with username %s exists", request.getUsername()))
        );

        Product product = productRepository.findById(request.getProductId()).orElseThrow(
                () -> new BusinessException(String.format(
                        "No product with id %s exists",
                        request.getProductId()
                )
                )
        );
        productReviewRepository.save(ProductReview.builder()
                .user(client)
                .product(product)
                .createdAt(new Date())
                .rating(request.getRating())
                .header(request.getHeader())
                .comment(request.getComment())
                .build());

        return "Review saved successfully";
    }


    @Override
    public List<ProductReviewVo> getProductReviews(Long id) {

        return productReviewRepository.findAllByProduct_Id(id)
                .stream()
                .map(
                        productReview -> modelMapper.map(productReview, ProductReviewVo.class)
                )
                .toList();
    }
}

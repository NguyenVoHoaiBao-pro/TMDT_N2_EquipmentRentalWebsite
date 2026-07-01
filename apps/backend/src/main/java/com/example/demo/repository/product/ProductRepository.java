package com.example.demo.repository.product;

import com.example.demo.entity.Product;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long>, JpaSpecificationExecutor<Product> {

    @Query("SELECT p FROM Product p WHERE p.category.name = :categoryName AND p.id <> :currentProductId")
    List<Product> findTop4ByCategoryNameAndIdNot(@Param("categoryName") String categoryName, @Param("currentProductId") Long currentProductId, Pageable pageable);

}

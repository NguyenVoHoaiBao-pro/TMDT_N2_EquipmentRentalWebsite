package com.example.demo.repository;

import com.example.demo.entity.IssueReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IssueReportRepository extends JpaRepository<IssueReport, Long> {
    List<IssueReport> findByReporterId(Long reporterId);

    List<IssueReport> findByOrderId(Long orderId);
}

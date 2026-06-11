package com.example.demo.service;

import com.example.demo.entity.Order;
import com.example.demo.entity.Device;
import com.example.demo.entity.DeviceCalendar;
import com.example.demo.enumValues.CalendarStatus; // ENUM: BOOKED, OWNER_BLOCK, MAINTENANCE
import com.example.demo.repository.IDeviceCalendarRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DeviceCalendarService {

    private final IDeviceCalendarRepository calendarRepository;

    // Hàm tiện ích nội bộ: Biến khoảng ngày (ví dụ: 15/06 -> 18/06) thành List [15, 16, 17, 18]
    private List<LocalDate> generateDateList(LocalDate startDate, LocalDate endDate) {
        if (startDate.isAfter(endDate)) {
            throw new IllegalArgumentException("Ngày bắt đầu không thể sau ngày kết thúc");
        }
        return startDate.datesUntil(endDate.plusDays(1)).toList();
    }

    @Transactional
    public void lockCalendarForOrder(Device device, LocalDate startDate, LocalDate endDate, Order order) {
        List<LocalDate> requestedDates = generateDateList(startDate, endDate);

        // 1. Gọi Repository kiểm tra xem có ngày nào trong danh sách đã bị khóa chưa
        long blockedCount = calendarRepository.countBlockedDates(device.getId(), requestedDates);
        if (blockedCount > 0) {
            throw new IllegalStateException("Thiết bị đã bị trùng lịch đặt trong khoảng thời gian này!");
        }

        // 2. Tạo hàng loạt bản ghi cho từng ngày bận và gán mã Order vào để đối chiếu
        List<DeviceCalendar> calendars = requestedDates.stream().map(date ->
            DeviceCalendar.builder()
                .device(device)
                .eventDate(date)
                .status(CalendarStatus.BOOKED)
                .order(order)
                .build()
        ).toList();

        calendarRepository.saveAll(calendars);
    }
}

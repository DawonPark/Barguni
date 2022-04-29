package com.ssafy.barguni.api.alert;

import com.ssafy.barguni.api.basket.repository.BasketRepository;
import com.ssafy.barguni.api.item.Item;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AlertService {
    private final AlertRepository alertRepository;
    private final BasketRepository basketRepository;

    public List<Alert> findAllByUserId(Long userId){
        List<Alert> alerts = alertRepository.findAllByUserId(userId);
        alerts.forEach((alert)->{
            basketRepository.getById(alert.getBasket().getId());
        });
        return alerts;
    }

    @Transactional
    public void updateStatusById(Long alertId, AlertStatus alertStatus) {
        Alert alert = alertRepository.getById(alertId);
        alert.setStatus(alertStatus);
    }

    @Transactional
    public void deleteById(Long alertId) {
        alertRepository.deleteById(alertId);
    }

    @Transactional
    public void createAlertBeforeExpiry(Item item) {
        alertRepository.save(new Alert(item, "의 유통기한이 임박했습니다."));
    }

    @Transactional
    public void createAlertAfterExpiry(Item item) {
        alertRepository.save(new Alert(item, "의 유통기한이 지났습니다."));
    }
}
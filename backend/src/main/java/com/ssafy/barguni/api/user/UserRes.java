package com.ssafy.barguni.api.user;

import com.ssafy.barguni.api.basket.entity.Basket;
import com.ssafy.barguni.api.basket.vo.BasketRes;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class UserRes {

    private Long userId;
    private String email;
    private String name;
    private BasketRes defaultBasket;

    public UserRes(Long userId, String email, String name, Basket defaultBasket) {
        this.userId = userId;
        this.email = email;
        this.name = name;
        this.defaultBasket = defaultBasket instanceof Basket? new BasketRes(defaultBasket) : null;
    }

    public static UserRes convertTo(User user) {
        return new UserRes(user.getId(), user.getEmail(), user.getName(), user.getDefaultBasket());
    }
}

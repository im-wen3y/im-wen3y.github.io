---
layout: default
title: "데이터를 가져오는 함수와 절차를 묶는 함수 — Service와 Repository 구분"
date: 2026-09-21 13:00:00 +0900
---

## 무엇을 몰랐나

API를 호출하는 함수라면 모두 Service라고 생각했다. 데이터를 가져오는 함수와 여러 작업을 순서대로 엮는 함수를 구분하지 못했다.

## 개념 정리

| | Repository | Service |
|---|---|---|
| 하는 일 | 데이터 원천(API, DB)과의 통신을 감춘다 | 여러 도메인 작업을 하나의 비즈니스 절차로 묶는다 |
| 예시 | 주문 목록 조회, 주문 단건 조회 | 재고 확인 → 주문 생성 → 결제 요청 |
| 바뀌는 이유 | 엔드포인트나 저장소가 바뀔 때 | 업무 규칙이나 순서가 바뀔 때 |

```ts
// Repository: 어디서 가져오는지만 감춘다
const orderRepository = {
  getOrders: (params: OrderListParams) => http.get('/orders', { params }),
}

// Service: 여러 작업의 순서를 조율한다
async function placeOrder(cart: Cart, user: User) {
  await stockRepository.check(cart)
  const order = await orderRepository.create(cart, user)
  return paymentRepository.request(order)
}
```

## 다시 볼 기준

- 이 함수가 감추는 것이 **데이터의 출처**인가, **작업의 순서**인가?
- 함수를 바꿔야 하는 이유가 API 변경인가, 업무 규칙 변경인가?

---

참고: [Repository (Martin Fowler)](https://martinfowler.com/eaaCatalog/repository.html) · [Service Layer (Martin Fowler)](https://martinfowler.com/eaaCatalog/serviceLayer.html)

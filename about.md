---
layout: default
title: 소개
permalink: /about/
---
<div class="container article-layout article-layout--single">
  <article class="article">
    <header class="article__head">
      <p class="article__category">소개</p>
      <h1 class="article__title">{{ site.author }}</h1>
      <div class="author">
        <img class="author__avatar" src="{{ site.profile.avatar }}" alt="" width="44" height="44">
        <div>
          <p class="author__name">{{ site.author }}</p>
          <p class="author__sub"><span>{{ site.profile.role }}</span><span>Java, Spring Boot</span></p>
        </div>
      </div>
    </header>
    <div class="prose" markdown="1">

Java와 Spring Boot로 백엔드를 개발하는 박주승입니다. API를 개발하고, 부하 테스트와 로그 분석으로 성능을 개선하고 있습니다. 이 블로그에서는 개발 과정에서 겪은 문제와 해결 방법을 공유합니다.

## 프로젝트

### 집사이 (zipsAI)

2026.09 ~ 현재, 백엔드 개발

입주민이 AI 채팅으로 불편 사항을 접수하고, 관리인이 이를 확인해 처리하는 원룸 건물 관리 서비스입니다.

- **AI 채팅 API**: 사용자 메시지를 AI 서버에 전달하고 응답을 저장하는 API를 구현했습니다. 외부 호출 타임아웃을 설정하고, 요청을 추적할 수 있도록 `trace_id`를 전달했습니다.
- **사진 첨부**: S3에 업로드한 사진을 대화 메시지에 첨부하는 기능을 구현했습니다. 파일 소유자와 업로드 상태를 검증한 뒤 이미지 URL을 AI 서버에 전달합니다.
- **민원 접수**: 대화 내용을 바탕으로 민원을 생성하고, 대화에 첨부된 첫 번째 사진을 대표 이미지로 저장하도록 구현했습니다.
- **대화 자동 종료**: 마지막 메시지 이후 5분이 지나면 대화가 종료되도록 구현했습니다. 대화 조회 시 경과 시간을 확인하는 방식과 주기적으로 실행되는 스케줄러를 함께 사용했습니다.
- **성능 개선**: OpenTelemetry와 Grafana로 로컬 부하 테스트 환경을 구성했습니다. 관리자 민원 목록의 최신순 조회를 위한 인덱스를 추가하고 불필요한 COUNT 쿼리를 제거했습니다. 로컬 환경에서 초당 75건의 요청을 보내는 테스트 기준, 전체 요청의 p95 응답 시간을 72.77ms에서 26.12ms로 줄였습니다.

[GitHub 저장소](https://github.com/100-hours-a-week/KTB4-19th-BE)

## 사용 기술

| 분야 | 사용 기술 |
| --- | --- |
| 언어, 프레임워크 | Java 25, Spring Boot 4, Spring Security, Spring Data JPA |
| 데이터 | MySQL 8.4, Flyway |
| 인프라 | AWS S3, Docker, GitHub Actions |
| 모니터링, 테스트 | Sentry, OpenTelemetry, Grafana, k6, JUnit 5 |

</div>
</article>
</div>

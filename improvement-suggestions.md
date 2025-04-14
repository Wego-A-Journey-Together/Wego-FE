# 코드 개선 사항 정리

## 성능 개선 (Performance)

### 컴포넌트 최적화
- `#P101` ChatNotice: 정적 컴포넌트이므로 React.memo 적용 검토 필요
- `#P102` SingleComment: 불필요한 리렌더링 방지를 위해 React.memo 적용 검토 필요
- `#P102` ChatPreview: 불필요한 리렌더링 방지를 위해 React.memo 적용 검토 필요
- `#P104` ChatRoom: 불필요한 리렌더링 방지를 위해 React.memo 적용 검토 필요

### 데이터 처리 최적화
- `#P101` ChatRoom: 시간 포맷팅 함수의 메모이제이션 검토 필요
- `#P104` SearchBar: 디바운스를 통한 검색 최적화 필요
- `#P105` ChatRoom: 메시지 데이터 변환 로직 최적화 필요
- `#P104` FetchMoreComments: 상태 업데이트 로직 최적화를 위해 useReducer 사용 검토 필요

### 이미지 최적화
- `#P104` ChatPreview: 이미지 최적화를 위한 next/image 속성 조정 필요
- `#P104` SingleComment: 이미지 최적화를 위한 priority, loading, sizes 속성 추가 필요

### 가상화 및 성능
- `#P103` CommentBundle: 댓글 목록이 많을 경우 가상화 적용 검토 필요
- `#P110` ChatRoom: 긴 메시지 목록에 대한 가상화 적용 검토 필요

### 기타 성능
- `#P101` LoadingThreeDots: 정적 애니메이션 설정은 컴포넌트 외부로 이동 필요
- `#P103` LoadingThreeDots: 스타일시트를 외부 CSS 파일로 분리하여 캐싱 활용 필요

## 타입 안정성 (Type Safety)

### 타입 정의
- `#T101` ChatPreview: ChatData 타입을 별도로 분리하여 재사용성 향상 필요
- `#T102` ChatRoom: Message 타입을 별도로 분리하여 재사용성 향상 필요
- `#T103` ChatRoom: ChatRoomProps 인터페이스에 필드 유효성 제약 추가 필요
- `#T101` LoginBtn: params.lang 타입 명시적 정의 필요
- `#T102` FetchMoreComments: 상태 관리에 대한 타입 명시적 정의 필요

## 접근성 (Accessibility)

### ARIA 레이블 및 역할
- `#A102` ChatNotice: 공지사항에 대한 ARIA 레이블과 역할 추가 필요
- `#A102` LoadingThreeDots: 로딩 상태를 스크린 리더에 알리기 위한 ARIA 속성 추가 필요
- `#A103` ChatPreview: 채팅방 목록 네비게이션을 위한 ARIA 레이블과 역할 추가 필요
- `#A107` ChatRoom: 로딩 상태에 대한 ARIA 레이블 추가 필요
- `#A109` ChatRoom: 채팅방 구조에 대한 ARIA 랜드마크와 레이블 추가 필요
- `#A105` FetchMoreComments: 버튼에 대한 ARIA 레이블과 역할 추가 필요
- `#A107` SingleComment: 날짜 정보를 스크린 리더에 적절히 전달하도록 개선 필요

### 키보드 접근성
- `#A105` SearchBar: 키보드 트랩 관리 및 포커스 순환 필요
- `#A105` NavBar: 모바일 메뉴의 키보드 접근성 개선 필요

## 사용자 경험 (User Experience)

### UI/UX 개선
- `#U105` ChatPreview: 긴 메시지 truncate 시 툴팁으로 전체 내용 표시 필요
- `#U106` ChatPreview: 메시지 내용이 비어있을 때의 대체 텍스트 표시 필요
- `#U106` ChatRoom: 스크롤 동작에 대한 사용자 설정 옵션 제공 필요
- `#U103` SearchBar: 검색 중 로딩 상태 표시 필요
- `#U104` NavBar: 반응형 레이아웃 전환 시 부드러운 애니메이션 추가 필요
- `#U105` SingleComment: 작성자 프로필 클릭 시 프로필 페이지로 이동 기능 추가 검토
- `#U108` SingleComment: 답글 버튼에 호버/포커스 상태 스타일 추가 필요

## 에러 처리 (Error Handling)

### 에러 처리 및 복구
- `#E103` FetchMoreComments: 댓글 로딩 실패 시 에러 처리 및 재시도 기능 필요
- `#E106` PostComment: 댓글 로딩 실패 시 에러 처리 및 재시도 기능 필요
- `#E108` ChatRoom: 구체적인 에러 메시지와 재시도 옵션 제공 필요

## 보안 (Security)

### 데이터 보안
- `#S106` SingleComment: XSS 방지를 위한 댓글 내용 이스케이프 처리 필요

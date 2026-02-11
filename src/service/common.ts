export interface CommonResponse<T> {
  // 1. 상태 정보 (성공/실패 여부를 직관적으로 분리)
  success: boolean;
  status: {
    code: number; // HTTP 상태 코드 혹은 커스텀 에러 코드
    message: string; // 사용자에게 보여줄 메시지
  };

  data: T;

  // 3. 부가 정보 (필터, 페이지네이션 등 - 선택 사항)
  metadata?: {
    filters?: FilterGroup[];
    pagination?: Pagination;
  };
}

export interface FilterItem {
  name: string;
  code: string;
  count: number;
}

// 검색필터
export interface FilterGroup {
  type: string;
  title: string;
  items: FilterItem[];
}

// 페이지네이션
export interface Pagination {
  currentPage: number;
  totalPages: number;
  totalElements: number;
}

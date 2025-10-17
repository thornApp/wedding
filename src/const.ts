import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
import timezone from "dayjs/plugin/timezone"
import "dayjs/locale/ko"

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.locale("ko")

export { dayjs }

export const WEDDING_DATE = dayjs.tz("2025-11-23 14:00", "Asia/Seoul")
export const WEDDING_DATE_FORMAT = `YYYY년 MMMM D일 dddd A h시${WEDDING_DATE.minute() === 0 ? "" : " m분"}`

// 예식 당월 휴무일. 켈린더에 표시하기 위함.
// 예: 예식일 8월 -> 8월 15일 광복절
export const HOLIDAYS = [15]

export const LOCATION = "천안 베리컨벤션"
export const LOCATION_ADDRESS = "천안시 동남구 구성동 137-2, 본관 1층 라벤더홀"

// 카카오톡 공유 시 위치 정보로 사용할 주소.
// LOCATION 과 동일하게 설정해도 무방하나, 필요에 따라 좀 더 상세히 작성 가능.
export const SHARE_ADDRESS = LOCATION
export const SHARE_ADDRESS_TITLE = LOCATION

// 네이버 지도 및 카카오 네비게이션에 사용할 좌표. [경도, 위도] 형식.
export const WEDDING_HALL_POSITION = [36.7898184, 127.1751370]

// 네이버 지도의 웨딩홀 장소 ID
// 네이버 지도 웹페이지에서 웨딩홀 검색 후 URL에서 확인 가능.
// 예: https://map.naver.com/p/entry/place/13321741 -> 13321741
export const NMAP_PLACE_ID = 32629030

// 카카오 지도의 웨딩홀 장소 ID
// 카카오 지도 웹페이지에서 웨딩홀 검색 후 해당 장소에서 상세보기 클릭 시 URL에서 확인 가능.
// 예: https://place.map.kakao.com/8634826 -> 8634826
export const KMAP_PLACE_ID = 23786119

export const BRIDE_FULLNAME = "방민정"
export const BRIDE_FIRSTNAME = "민정"
export const BRIDE_TITLE = "장녀"
export const BRIDE_FATHER = "방수원"
export const BRIDE_MOTHER = "신현희"
export const BRIDE_INFO = [
  {
    relation: "신부",
    name: BRIDE_FULLNAME,
    phone: "010-4731-6994",
    account: "우리은행 0000000000000",
  },
  {
    relation: "신부 아버지",
    name: BRIDE_FATHER,
    phone: "010-0000-0000",
    account: "하나은행 680-910035-89807",
  },
  {
    relation: "신부 어머니",
    name: BRIDE_MOTHER,
    phone: "010-0000-0000",
    account: "하나은행 00000000000000",
  },
]

export const GROOM_FULLNAME = "최병전"
export const GROOM_FIRSTNAME = "병전"
export const GROOM_TITLE = "차남"
export const GROOM_FATHER = "최경남"
export const GROOM_MOTHER = "신금용"
export const GROOM_INFO = [
  {
    relation: "신랑",
    name: GROOM_FULLNAME,
    phone: "010-2266-6347",
    account: "신한은행 110-510-573681",
  },
  {
    relation: "신랑 아버지",
    name: GROOM_FATHER,
    phone: "010-5463-6347",
    account: "국민은행 712401-01-677565",
  },
  {
    relation: "신랑 어머니",
    name: GROOM_MOTHER,
    phone: "010-6239-6347",
    account: "우리은행 1002-541-642676",
  },
]

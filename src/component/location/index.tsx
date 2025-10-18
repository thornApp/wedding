import { Map } from "./map"
import CarIcon from "../../icons/car-icon.svg?react"
import BusIcon from "../../icons/bus-icon.svg?react"
import { LazyDiv } from "../lazyDiv"
import { LOCATION, LOCATION_ADDRESS } from "../../const"

export const Location = () => {
  return (
    <>
      <LazyDiv className="card location">
        <h2 className="english">Location</h2>
        <div className="addr">
          {LOCATION}
          <div className="detail">{LOCATION_ADDRESS}</div>
        </div>
        <Map />
      </LazyDiv>
      <LazyDiv className="card location">
        <div className="location-info">
          <div className="transportation-icon-wrapper">
            <BusIcon className="transportation-icon" />
          </div>
          <div className="heading">셔틀버스</div>
          <div />
          <div className="content">
            <b>천안터미널 출발</b> → <b>천안역 경유</b> → <b>베리컨벤션 도착</b>
            <br />
            오전 10시부터 30분 간격으로 운행( 천안터미널 기준 )
            <br />
            <b>* 천안터미널 탑승장소</b>
            <br />
            천안터미널 신세계백화점옆 "올리브영" 매장 앞
            <br />
            <b>* 천안역 탑승장소</b>
            <br />
            천안역 1번출구 동부광장 횡단보도 건너편 "빈폴매장"옆의 "GS25 편의점" 앞
          </div>
          <div />
        </div>
        <div className="location-info">
          <div className="transportation-icon-wrapper">
            <CarIcon className="transportation-icon" />
          </div>
          <div className="heading">자가용</div>
          <div />
          <div className="content">
            네이버 지도, 카카오 네비, 티맵 등 이용
            <br />
            <b>천안 베리컨벤션</b> 검색
            <br />
            - 주차 요금은 무료입니다.
            <br />
          </div>
          <div />
          <div className="content">
            <b>
              ※ [천안IC]로 나와서 [천안삼거리]방면으로 5분
              ※ [목천IC]로 나와서 [천안IC]방면으로 15분
            </b>
          </div>
        </div>
      </LazyDiv>
    </>
  )
}

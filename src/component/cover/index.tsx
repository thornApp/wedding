import React, { useEffect, useState } from "react"
import {
  BRIDE_FULLNAME,
  GROOM_FULLNAME,
  LOCATION,
  WEDDING_DATE,
  WEDDING_DATE_FORMAT,
} from "../../const"
import { COVER_IMAGE } from "../../images"
import { LazyDiv } from "../lazyDiv"
import { Button } from "../button"

// BGM public 폴더 경로
const BGM_URL = "/wedding/bgm.mp3"

// HTMLAudioElement 확장 타입
interface AudioWithPlaysInline extends HTMLAudioElement {
  playsInline?: boolean
}

const DAY_OF_WEEK = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
]

export const Cover: React.FC = () => {
  // BGM 상태
  const [audio] = useState<AudioWithPlaysInline>(() => new Audio(BGM_URL))
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    audio.loop = true
    audio.autoplay = true
    audio.playsInline = true
    audio.muted = false

    audio
      .play()
      .then(() => setPlaying(true))
      .catch(() => console.log("브라우저 자동 재생 제한됨"))

    return () => {
      audio.pause()
    }
  }, [audio])

  const toggleBgm = () => {
    if (playing) {
      audio.pause()
      setPlaying(false)
    } else {
      audio
        .play()
        .then(() => setPlaying(true))
        .catch(() => console.log("브라우저 자동 재생 제한됨"))
    }
  }

  return (
    <LazyDiv className="card cover">
      <div className="wedding-date-wrapper" style={{ display: "flex", flexDirection: "column-reverse", alignItems: "center" }}>
        <div className="wedding-date">
          {WEDDING_DATE.format("YYYY")}
          <div className="divider" />
          {WEDDING_DATE.format("MM")}
          <div className="divider" />
          {WEDDING_DATE.format("DD")}
        </div>

        <Button className="play-bgm-button" onClick={toggleBgm} style={{ height: "fit-content", alignSelf: "end" }} >
          {playing ? "Pause BGM" : "Play BGM"}
        </Button>
      </div>
      <div className="wedding-day-of-week">
        {DAY_OF_WEEK[WEDDING_DATE.day()]}
      </div>
      <div className="image-wrapper">
        <img src={COVER_IMAGE} alt="sample" />
      </div>
      <div className="subtitle">Save the date for the wedding of</div>
      <div className="names">
        {GROOM_FULLNAME}
        <div className="divider" />
        {BRIDE_FULLNAME}
      </div>
      <div className="info">{WEDDING_DATE.format(WEDDING_DATE_FORMAT)}</div>
      <div className="info">{LOCATION}</div>
    </LazyDiv>
  )
}
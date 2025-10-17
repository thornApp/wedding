import React, { useEffect, useState, Fragment } from "react"
import {
  BRIDE_FULLNAME,
  BRIDE_INFO,
  BRIDE_FATHER,
  BRIDE_MOTHER,
  GROOM_FULLNAME,
  GROOM_INFO,
  GROOM_FATHER,
  GROOM_MOTHER,
  GROOM_TITLE,
  BRIDE_TITLE,
} from "../../const"
import { useModal } from "../modal"
import { Button } from "../button"
import { LazyDiv } from "../lazyDiv"
import PhoneIcon from "../../icons/phone-flip-icon.svg?react"
import EnvelopeIcon from "../../icons/envelope-icon.svg?react"

// BGM은 public 폴더에 넣고 절대 경로 사용
const BGM_URL = "/wedding/bgm.mp3"

// HTMLAudioElement 확장 타입 (playsInline 허용)
interface AudioWithPlaysInline extends HTMLAudioElement {
  playsInline?: boolean
}

export const Invitation: React.FC = () => {
  const { openModal, closeModal } = useModal()

  // BGM 상태 관리
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
    <LazyDiv className="card invitation">
      {/* BGM Play/Pause 버튼 */}
      <div style={{ textAlign: "center", marginBottom: "10px" }}>
        <Button onClick={toggleBgm}>
          {playing ? "Pause BGM" : "Play BGM"}
        </Button>
      </div>

      <h2 className="english">Invitation</h2>

      <div className="break" />

      <div className="content">싱그러운 여름 향기 가득한 날</div>
      <div className="content">소중한 분들을 모시고</div>
      <div className="content">사랑의 약속을 하려고 합니다.</div>
      <div className="break" />
      <div className="content">햇살이 뜨거울 땐 가려주고,</div>
      <div className="content">비가 오면 우산이 되어주는</div>
      <div className="content">부부가 되겠습니다.</div>
      <div className="break" />
      <div className="content">기쁜날 함께 하시어</div>
      <div className="content">저희의 앞날을 축복해 주세요.</div>

      <div className="break" />

      <div className="name">
        {GROOM_FATHER} · {GROOM_MOTHER}
        <span className="relation">
          의 <span className="relation-name">{GROOM_TITLE}</span>
        </span>{" "}
        {GROOM_FULLNAME}
      </div>
      <div className="name">
        {BRIDE_FATHER} · {BRIDE_MOTHER}
        <span className="relation">
          의 <span className="relation-name">{BRIDE_TITLE}</span>
        </span>{" "}
        {BRIDE_FULLNAME}
      </div>

      <div className="break" />

      {/* 연락하기 버튼 */}
      <Button
        onClick={() => {
          openModal({
            className: "contact-modal",
            closeOnClickBackground: true,
            header: (
              <div className="title-group">
                <div className="title">축하 인사 전하기</div>
                <div className="subtitle">
                  전화, 문자메세지로 축하 인사를 전해보세요.
                </div>
              </div>
            ),
            content: (
              <>
                <div className="contact-info">
                  {GROOM_INFO.filter(({ phone }) => !!phone).map(
                    ({ relation, name, phone }) => (
                      <Fragment key={relation}>
                        <div className="relation">{relation}</div>
                        <div>{name}</div>
                        <div>
                          <PhoneIcon
                            className="flip icon"
                            onClick={() => window.open(`tel:${phone}`, "_self")}
                          />
                          <EnvelopeIcon
                            className="icon"
                            onClick={() =>
                              window.open(`sms:${phone}`, "_self")
                            }
                          />
                        </div>
                      </Fragment>
                    ),
                  )}
                </div>
                <div className="contact-info">
                  {BRIDE_INFO.filter(({ phone }) => !!phone).map(
                    ({ relation, name, phone }) => (
                      <Fragment key={relation}>
                        <div className="relation">{relation}</div>
                        <div>{name}</div>
                        <div>
                          <PhoneIcon
                            className="flip icon"
                            onClick={() => window.open(`tel:${phone}`, "_self")}
                          />
                          <EnvelopeIcon
                            className="icon"
                            onClick={() =>
                              window.open(`sms:${phone}`, "_self")
                            }
                          />
                        </div>
                      </Fragment>
                    ),
                  )}
                </div>
              </>
            ),
            footer: (
              <Button
                buttonStyle="style2"
                className="bg-light-grey-color text-dark-color"
                onClick={closeModal}
              >
                닫기
              </Button>
            ),
          })
        }}
      >
        연락하기
      </Button>
    </LazyDiv>
  )
}

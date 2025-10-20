import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import Lightbox from "yet-another-react-lightbox"
import Zoom from "yet-another-react-lightbox/plugins/zoom"
import "yet-another-react-lightbox/styles.css"

import ArrowLeft from "../../icons/angle-left-sm.svg?react"
import { LazyDiv } from "../lazyDiv"
import { Button } from "../button"
import { useModal } from "../modal"
import { GALLERY_IMAGES } from "../../images"

const CAROUSEL_ITEMS = GALLERY_IMAGES.map((item, idx) => (
  <div className="carousel-item" key={idx}>
    <img
      src={item}
      draggable={false}
      alt={`${idx}`}
      style={{ cursor: "pointer" }}
    />
  </div>
))

const DRAG_SENSITIVITY = 15

type Status =
  | "stationary"
  | "clicked"
  | "clickCanceled"
  | "dragging"
  | "dragEnding"
  | "moving-left"
  | "moving-right"

type DragOption = {
  startingClientX: number
  startingClientY: number
  currentTranslateX: number
}

type ClickMove = "left" | "right" | null

export const Gallery = () => {
  const { openModal, closeModal } = useModal()
  const carouselRef = useRef<HTMLDivElement>({} as HTMLDivElement)

  useEffect(() => {
    // 이미지 프리로드
    GALLERY_IMAGES.forEach((image) => {
      const img = new Image()
      img.src = image
    })
  }, [])

  const [slide, _setSlide] = useState(0)
  const slideRef = useRef(0)
  const setSlide = (slide: number) => {
    _setSlide(slide)
    slideRef.current = slide
  }

  const [status, _setStatus] = useState<Status>("stationary")
  const statusRef = useRef<Status>("stationary")
  const setStatus = (status: Status) => {
    _setStatus(status)
    statusRef.current = status
  }

  const [dragOption, _setDragOption] = useState<DragOption>({
    startingClientX: 0,
    startingClientY: 0,
    currentTranslateX: 0,
  })
  const dragOptionRef = useRef<DragOption>({
    startingClientX: 0,
    startingClientY: 0,
    currentTranslateX: 0,
  })
  const setDragOption = (dragOption: DragOption) => {
    _setDragOption(dragOption)
    dragOptionRef.current = dragOption
  }

  const [moveOption, setMoveOption] = useState({
    srcIdx: 0,
    dstIdx: 0,
  })

  const clickMoveRef = useRef<ClickMove>(null)
  const setClickMove = (clickMove: ClickMove) => {
    clickMoveRef.current = clickMove
  }

  const click = (
    status: Status,
    clientX: number,
    clientY: number,
    carouselWidth: number,
  ) => {
    if (status !== "stationary") return
    setDragOption({
      startingClientX: clientX,
      startingClientY: clientY,
      currentTranslateX: -carouselWidth,
    })
    setStatus("clicked")
  }

  const dragging = useCallback(
    (dragOption: DragOption, clientX: number, carouselWidth: number) => {
      let moveTranslateX = clientX - dragOption.startingClientX

      if (moveTranslateX > carouselWidth) moveTranslateX = carouselWidth
      else if (moveTranslateX < -carouselWidth) moveTranslateX = -carouselWidth

      setDragOption({
        ...dragOption,
        currentTranslateX: moveTranslateX - carouselWidth,
      })
    },
    [],
  )

  const dragEnd = useCallback(
    (slide: number, dragOption: DragOption, carouselWidth: number) => {
      let move = 0
      if (dragOption.currentTranslateX < -carouselWidth * 1.1) move = 1
      else if (dragOption.currentTranslateX > -carouselWidth * 0.9) move = -1

      setDragOption({
        ...dragOption,
        currentTranslateX: -carouselWidth * (move + 1),
      })
      setStatus("dragEnding")

      setTimeout(() => {
        setDragOption({ ...dragOption, currentTranslateX: -carouselWidth })
        setStatus("stationary")
        setSlide((slide + move + CAROUSEL_ITEMS.length) % CAROUSEL_ITEMS.length)
      }, 300)
    },
    [],
  )

  const move = useCallback(
    (srcIdx: number, dstIdx: number) => {
      setSlide(dstIdx)
      if (srcIdx < dstIdx) setStatus("moving-right")
      else setStatus("moving-left")
      setMoveOption({ srcIdx, dstIdx })
      setTimeout(() => {
        setClickMove(null)
        setStatus("stationary")
      }, 300)
    },
    [],
  )

  /* Mouse & Touch Events */
  const onMouseMove = useCallback(
    (e: MouseEvent) => {
      const status = statusRef.current
      if (status === "clicked") setStatus("dragging")
      else if (status === "dragging") {
        e.preventDefault()
        dragging(dragOptionRef.current, e.clientX, carouselRef.current.clientWidth)
      }
    },
    [dragging],
  )

  const onTouchMove = useCallback(
    (e: TouchEvent) => {
      const status = statusRef.current
      if (status === "clicked") {
        e.preventDefault()
        const xMove = e.targetTouches[0].clientX - dragOptionRef.current.startingClientX
        const yMove = e.targetTouches[0].clientY - dragOptionRef.current.startingClientY
        if (Math.abs(xMove) > DRAG_SENSITIVITY) setStatus("dragging")
        else if (Math.abs(yMove) > DRAG_SENSITIVITY) setStatus("clickCanceled")
      } else if (status === "dragging") {
        e.preventDefault()
        dragging(
          dragOptionRef.current,
          e.targetTouches[0].clientX,
          carouselRef.current.clientWidth,
        )
      }
    },
    [dragging],
  )

  const onMouseTouchUp = useCallback(() => {
    const status = statusRef.current
    const clickMove = clickMoveRef.current
    const slide = slideRef.current

    if (status === "clicked") {
      if (clickMove === "left")
        move(slide, (slide + CAROUSEL_ITEMS.length - 1) % CAROUSEL_ITEMS.length)
      else if (clickMove === "right")
        move(slide, (slide + 1) % CAROUSEL_ITEMS.length)
      else setStatus("stationary")
    } else if (status === "dragging")
      dragEnd(slide, dragOptionRef.current, carouselRef.current.clientWidth)
    else if (status === "clickCanceled") setStatus("stationary")
  }, [dragEnd, move])

  useEffect(() => {
    const carouselElement = carouselRef.current
    window.addEventListener("mousemove", onMouseMove)
    carouselElement.addEventListener("touchmove", onTouchMove)
    window.addEventListener("mouseup", onMouseTouchUp)
    window.addEventListener("touchend", onMouseTouchUp)
    return () => {
      window.removeEventListener("mousemove", onMouseMove)
      carouselElement.removeEventListener("touchmove", onTouchMove)
      window.removeEventListener("mouseup", onMouseTouchUp)
      window.removeEventListener("touchend", onMouseTouchUp)
    }
  }, [onMouseMove, onTouchMove, onMouseTouchUp])

  const transformStyle = useMemo(() => {
    if (["dragging", "dragEnding"].includes(status))
      return { transform: `translateX(${dragOption.currentTranslateX}px)` }
    return {}
  }, [status, dragOption])

  const transformClass = useMemo(() => {
    const className = "carousel-list"
    switch (status) {
      case "dragEnding":
        return className + " transitioning"
      case "moving-left":
        return className + " moving-left"
      case "moving-right":
        return className + " moving-right"
      default:
        return className
    }
  }, [status])

  // Lightbox
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)
  const onCarouselImageClick = (idx: number) => {
    setLightboxIndex(idx)
    setLightboxOpen(true)
  }

  return (
    <LazyDiv className="card gallery">
      <h2 className="english">Gallery</h2>
      <div className="carousel-wrapper">
        <div
          className="carousel"
          ref={carouselRef}
          onMouseDown={(e) =>
            click(statusRef.current, e.clientX, e.clientY, e.currentTarget.clientWidth)
          }
          onTouchStart={(e) =>
            click(
              statusRef.current,
              e.targetTouches[0].clientX,
              e.targetTouches[0].clientY,
              e.currentTarget.clientWidth,
            )
          }
        >
          <div className={transformClass} style={transformStyle}>
            {["dragging", "dragEnding"].includes(status) && [
              ...(slide === 0
                ? [CAROUSEL_ITEMS[CAROUSEL_ITEMS.length - 1]]
                : []),
              ...CAROUSEL_ITEMS.slice(slide === 0 ? 0 : slide - 1, slide + 2),
              ...(slide === CAROUSEL_ITEMS.length - 1
                ? [CAROUSEL_ITEMS[0]]
                : []),
            ]}
            {status === "moving-right" &&
              CAROUSEL_ITEMS.slice(moveOption.srcIdx, moveOption.dstIdx + 1)}
            {status === "moving-left" &&
              CAROUSEL_ITEMS.slice(moveOption.dstIdx, moveOption.srcIdx + 1)}
            {["stationary", "clicked", "clickCanceled"].includes(status) &&
              <div onClick={() => onCarouselImageClick(slide)}>
                {CAROUSEL_ITEMS[slide]}
              </div>}
          </div>

          {/* 좌우 버튼 복원 */}
          <div className="carousel-control">
            <div
              className="control left"
              onMouseDown={() => {
                if (statusRef.current === "stationary") setClickMove("left")
              }}
              onTouchStart={() => {
                if (statusRef.current === "stationary") setClickMove("left")
              }}
            >
              <ArrowLeft className="arrow" />
            </div>
            <div
              className="control right"
              onMouseDown={() => {
                if (statusRef.current === "stationary") setClickMove("right")
              }}
              onTouchStart={() => {
                if (statusRef.current === "stationary") setClickMove("right")
              }}
            >
              <ArrowLeft className="arrow right" />
            </div>
          </div>
        </div>
      </div>

      <div className="break" />

      {/* 전체보기 버튼 */}
      <Button
        onClick={() =>
          openModal({
            className: "all-photo-modal",
            closeOnClickBackground: true,
            header: <div className="title">사진 전체보기</div>,
            content: (
              <div className="photo-list">
                {GALLERY_IMAGES.map((image, idx) => (
                  <img
                    key={idx}
                    src={image}
                    alt={`${idx}`}
                    draggable={false}
                    onClick={() => {
                      if (statusRef.current === "stationary") {
                        if (idx !== slideRef.current) move(slideRef.current, idx)
                        closeModal()
                      }
                    }}
                  />
                ))}
              </div>
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
        }
      >
        사진 전체보기
      </Button>

      {/* Lightbox (화면 전체보기) */}
      <Lightbox
        open={lightboxOpen}
        index={lightboxIndex}
        close={() => setLightboxOpen(false)}
        slides={GALLERY_IMAGES.map((src) => ({ src }))}
        plugins={[Zoom]}
      />
    </LazyDiv>
  )
}

import { useState, useEffect, useCallback } from 'react'
import countDownData from '/public/sound/count_down.mp3'
import startData from '/public/sound/start.mp3'
import finishData from '/public/sound/finish.mp3'

const audioContext = new (window.AudioContext || window.webkitAudioContext)() as AudioContext;

export function useAudio(soundUrl: string): { playSound: () => void } {
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    async function initializeAudio() {
      try {
        const res = await fetch(soundUrl)
        const arrayBuffer = await res.arrayBuffer()
        const buffer = await audioContext.decodeAudioData(arrayBuffer)
        setAudioBuffer(buffer)
      } catch (error) {
        console.error('音声ファイルのロード失敗:', error)
      }
    }
    initializeAudio()
  }, [soundUrl])

  useEffect(() => {
    const handleUserInteraction = (): void => {
      if (audioContext.state === 'suspended') {
        audioContext.resume()
      }
    }

    document.addEventListener('click', handleUserInteraction)
    document.addEventListener('touchstart', handleUserInteraction)

    return () => {
      document.removeEventListener('click', handleUserInteraction)
      document.removeEventListener('touchstart', handleUserInteraction)
    }
  }, [])

  const playSound = useCallback((): void => {
    if (audioBuffer && audioContext && !isPlaying) {
      setIsPlaying(true)
      const source = audioContext.createBufferSource()
      source.buffer = audioBuffer
      source.connect(audioContext.destination)
      source.start(0)
      source.onended = () => {
        setIsPlaying(false)
      }
    }
  }, [audioBuffer])

  return { playSound }
}

export function useCountDownSound() {
  return useAudio(countDownData)
}

export function useStartSound() {
  return useAudio(startData)
}

export function useFinishSound() {
  return useAudio(finishData)
}
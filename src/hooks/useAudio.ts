import { useState, useEffect, useCallback } from 'react'
import moveNextSet from '/public/sound/move_next_set.mp3'

const audioContext = new (window.AudioContext || window.webkitAudioContext)() as AudioContext;

export function useAudio(): { playSound: () => void } {
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    async function initializeAudio() {
      try {
        const response = await fetch(moveNextSet)
        const arrayBuffer = await response.arrayBuffer()
        const buffer = await audioContext.decodeAudioData(arrayBuffer)
        setAudioBuffer(buffer)
      } catch (error) {
        console.error('音声ファイルのロード失敗:', error)
      }
    }
    initializeAudio()
  }, [])

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
  }, [audioBuffer, isPlaying])

  return { playSound }
}
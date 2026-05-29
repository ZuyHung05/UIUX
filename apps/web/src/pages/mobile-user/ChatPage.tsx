import React, { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import './ChatPage.css'
import {
  ArrowLeftIcon,
  BellIcon,
  BotAvatarIcon,
  MicIcon,
  PlusIcon,
  SendIcon,
  AppointmentActionIcon,
  CallActionIcon,
} from '../../assets/icons/mobileUserHomeIcons'

type Message = {
  id: string
  sender: 'user' | 'assistant'
  text?: string
  kind?: 'normal' | 'emergency'
}

type Choice = {
  label: string
}

const choices: Choice[] = [
  { label: 'Mới bị lúc nãy' },
  { label: 'Khoảng 2-3 tiếng' },
  { label: 'Đã bị từ sáng' },
]

function HeaderAvatar() {
  return (
    <div className="chat-header-avatar" aria-hidden="true">
      <svg viewBox="0 0 44 44">
        <circle cx="22" cy="22" r="22" fill="#eef2f7" />
        <circle cx="22" cy="17" r="6" fill="#94a3b8" />
        <path d="M10.5 36a11.5 11.5 0 0 1 23 0" fill="#94a3b8" />
      </svg>
    </div>
  )
}

function ChatBubble({
  children,
  variant = 'assistant',
}: {
  children: ReactNode
  variant?: 'assistant' | 'user'
}) {
  return (
    <div className={`chat-bubble ${variant === 'user' ? 'is-user' : 'is-assistant'}`}>
      {children}
    </div>
  )
}

function QuickChoice({ label }: Choice) {
  return (
    <button className="chat-choice" type="button">
      {label}
    </button>
  )
}

export function MobileUserChatPage() {
  const navigate = useNavigate()
  const { state } = useLocation()
  const initialMessage = (state as any)?.initialMessage as string | undefined
  const [messages, setMessages] = useState<Message[]>([])
  const [composeText, setComposeText] = useState('')

  function handleSend() {
    const text = composeText.trim()
    if (!text) return
    const userMsg: Message = { id: `m-${Date.now()}`, sender: 'user', text, kind: 'normal' }
    const isEmergency = /tim|đau tim|tim mạch/i.test(text)
    const assistantMsg: Message = isEmergency
      ? {
          id: `m-${Date.now()}-a`,
          sender: 'assistant',
          kind: 'emergency',
          text:
            'CẢNH BÁO KHẨN CẤP\nTriệu chứng của bạn có thể là tình trạng tim mạch nghiêm trọng. Hãy gọi cấp cứu ngay lập tức (115) hoặc nằm nghỉ và nhờ người xung quanh hỗ trợ.',
        }
      : { id: `m-${Date.now()}-a`, sender: 'assistant', text: 'Tôi hiểu. Bạn bị như vậy bao lâu rồi?', kind: 'normal' }

    setMessages((prev) => [...prev, userMsg, assistantMsg])
    setComposeText('')
  }

  useEffect(() => {
    if (initialMessage) {
      const userMsg: Message = { id: 'm-user-1', sender: 'user', text: initialMessage, kind: 'normal' }
      const isEmergency = /tim|đau tim|tim mạch/i.test(initialMessage)
      const assistantMsg: Message = isEmergency
        ? {
            id: 'm-assist-1',
            sender: 'assistant',
            kind: 'emergency',
            text:
              'CẢNH BÁO KHẨN CẤP\nTriệu chứng của bạn có thể là tình trạng tim mạch nghiêm trọng. Hãy gọi cấp cứu ngay lập tức (115) hoặc nằm nghỉ và nhờ người xung quanh hỗ trợ.',
          }
        : { id: 'm-assist-1', sender: 'assistant', text: 'Tôi hiểu. Bạn bị như vậy bao lâu rồi?', kind: 'normal' }

      setMessages([userMsg, assistantMsg])
      return
    }

    // default conversation when no initialMessage provided
    setMessages([
      { id: 'm-user-default', sender: 'user', text: 'Tôi bị đau đầu', kind: 'normal' },
      {
        id: 'm-assist-default',
        sender: 'assistant',
        text:
          'Nghe bạn nói bị đau đầu, tôi rất tiếc. Tình trạng này chắc chắn rất khó chịu. Bạn đã bị như vậy bao lâu rồi?',
        kind: 'normal',
      },
    ])
  }, [initialMessage])

  return (
    <main className="chat-page">
      <div className="chat-screen">
        <header className="chat-header">
          <HeaderAvatar />
          <div className="chat-header-copy">
            <h1>Hello, Sarah</h1>
            <p>Tôi có thể giúp gì cho bạn ?</p>
          </div>
          <button className="chat-notification-button" type="button" aria-label="Thông báo">
            <BellIcon />
          </button>
        </header>

        <button
          className="chat-back-button"
          type="button"
          onClick={() => navigate('/mobile-user/home')}
          aria-label="Quay lại trang chủ"
        >
          <ArrowLeftIcon />
        </button>

        <section className="chat-thread" aria-label="Cuộc hội thoại">
          {messages.map((m) =>
            m.sender === 'user' ? (
              <div className="chat-thread-user-row" key={m.id}>
                <ChatBubble variant="user">{m.text}</ChatBubble>
              </div>
            ) : (
              <div className="chat-thread-assistant-row" key={m.id}>
                <div className="chat-assistant-avatar" aria-hidden="true">
                  <BotAvatarIcon />
                </div>
                <div className="chat-thread-assistant-stack">
                  {m.kind === 'emergency' ? (
                    <>
                      <div className="emergency-card">
                        <strong className="emergency-title">CẢNH BÁO KHẨN CẤP</strong>
                        <p className="emergency-body">
                          Triệu chứng của bạn có thể là tình trạng tim mạch nghiêm trọng. Hãy gọi cấp
                          cứu ngay lập tức (115) hoặc nằm nghỉ và nhờ người xung quanh hỗ trợ.
                        </p>
                      </div>
                      <div className="emergency-actions">
                        <button className="emergency-btn">
                          <AppointmentActionIcon />
                          Đặt lịch khám
                        </button>
                        <button className="emergency-btn emergency-btn--call">
                          <CallActionIcon />
                          Gọi cấp cứu (115)
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <ChatBubble>{m.text}</ChatBubble>
                      <div className="chat-choices">
                        {choices.map((choice) => (
                          <QuickChoice key={choice.label} {...choice} />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            ),
          )}
        </section>

        <form className="chat-compose" onSubmit={(event) => {
            event.preventDefault()
            handleSend()
          }}>
          <button
            className="chat-compose-action chat-compose-action-left"
            type="button"
            aria-label="Thêm tệp"
          >
            <PlusIcon />
          </button>
          <input
            type="text"
            placeholder="Hỏi AI Y tế..."
            aria-label="Nhập tin nhắn"
            value={composeText}
            onChange={(e) => setComposeText(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleSend() } }}
          />
          <button
            className="chat-compose-action chat-compose-action-mic"
            type="button"
            aria-label="Ghi âm"
          >
            <MicIcon />
          </button>
          <button className="chat-send-button" type="submit" aria-label="Gửi tin nhắn">
            <SendIcon />
          </button>
        </form>
      </div>
    </main>
  )
}

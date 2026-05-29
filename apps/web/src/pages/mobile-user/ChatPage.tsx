import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import './ChatPage.css'
import {
  ArrowLeftIcon,
  BellIcon,
  BotAvatarIcon,
  MicIcon,
  PlusIcon,
  SendIcon,
} from '../../assets/icons/mobileUserHomeIcons'

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

function ChatBubble({ children, variant = 'assistant' }: { children: ReactNode; variant?: 'assistant' | 'user' }) {
  return <div className={`chat-bubble ${variant === 'user' ? 'is-user' : 'is-assistant'}`}>{children}</div>
}

function QuickChoice({ label }: Choice) {
  return <button className="chat-choice" type="button">{label}</button>
}

export function MobileUserChatPage() {
  const navigate = useNavigate()

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

        <button className="chat-back-button" type="button" onClick={() => navigate('/mobile-user/home')} aria-label="Quay lại trang chủ">
          <ArrowLeftIcon />
        </button>

        <section className="chat-thread" aria-label="Cuộc hội thoại">
          <div className="chat-thread-user-row">
            <ChatBubble variant="user">Tôi bị đau đầu</ChatBubble>
          </div>

          <div className="chat-thread-assistant-row">
            <div className="chat-assistant-avatar" aria-hidden="true">
              <BotAvatarIcon />
            </div>
            <div className="chat-thread-assistant-stack">
              <ChatBubble>
                Nghe bạn nói bị đau đầu, tôi rất tiếc. Tình trạng này chắc chắn rất khó chịu. Bạn đã bị như vậy bao lâu rồi?
              </ChatBubble>
              <div className="chat-choices">
                {choices.map((choice) => (
                  <QuickChoice key={choice.label} {...choice} />
                ))}
              </div>
            </div>
          </div>
        </section>

        <form className="chat-compose" onSubmit={(event) => event.preventDefault()}>
          <button className="chat-compose-action chat-compose-action-left" type="button" aria-label="Thêm tệp">
            <PlusIcon />
          </button>
          <input type="text" placeholder="Hỏi AI Y tế..." aria-label="Nhập tin nhắn" />
          <button className="chat-compose-action chat-compose-action-mic" type="button" aria-label="Ghi âm">
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
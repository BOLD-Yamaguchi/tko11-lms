import { useState } from 'react'
import type { ReactNode } from 'react'
import {
  Link,
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from 'react-router-dom'
import {
  BookIcon,
  CalendarIcon,
  ClockIcon,
  EditIcon,
  ReturnIcon,
} from './Icons'
import {
  ActionConfirmationModal,
  BackButton,
  BookActionModal,
  ModalDialog,
  ReturnRequestModal,
  Toast,
  UserMenu,
} from './components'
import { getReturnDueDate } from './dateUtils'
import { loanHistory } from './mockData'
import type { CatalogBook, LoanStatus, UserRole } from './types'

type BookDetailProps = {
  books: CatalogBook[]
  role: UserRole
  onStatusChange: (bookId: string, status: LoanStatus) => void
  historyVisibility: Record<string, string[]>
  onHistoryVisibilityChange: (bookId: string, visibleIds: string[]) => void
  returnComments: Record<string, string>
  onReturnCommentChange: (bookId: string, comment: string) => void
  onLogout: () => void
}

type LocationState = {
  message?: string
}

type BookAction =
  | 'reserve'
  | 'cancelReservation'
  | 'loan'
  | 'return'
  | 'requestReturn'
  | 'cancelReturnRequest'
  | 'approveReturn'

type ActionStep = 'auth' | 'confirm' | 'returnRequest' | 'approval'

type ActionDefinition = {
  id: BookAction
  label: string
  icon: ReactNode
}

const actionSettings: Record<BookAction, {
  title: string
  description: string
  confirmLabel: string
  nextStatus: LoanStatus
  message: string
}> = {
  reserve: {
    title: '予約の確認',
    description: 'この書籍を予約します。よろしいですか？',
    confirmLabel: '予約する',
    nextStatus: '予約中',
    message: '予約を受け付けました。',
  },
  cancelReservation: {
    title: '予約取消の確認',
    description: 'この書籍の予約を取り消します。よろしいですか？',
    confirmLabel: '予約を取り消す',
    nextStatus: '貸出可',
    message: '予約を取り消しました。',
  },
  loan: {
    title: '貸出登録',
    description: '貸出対象者を確認して、貸出登録を行います。',
    confirmLabel: '貸出する',
    nextStatus: '貸出中',
    message: '貸出登録を受け付けました。',
  },
  return: {
    title: '直接返却',
    description: '社員番号を入力して、直接返却を行います。',
    confirmLabel: '直接返却する',
    nextStatus: '貸出可',
    message: '直接返却を受け付けました。',
  },
  requestReturn: {
    title: '返却申請',
    description: 'この書籍の返却申請を行います。',
    confirmLabel: '返却申請する',
    nextStatus: '返却申請中',
    message: '返却申請を受け付けました。',
  },
  cancelReturnRequest: {
    title: '返却申請取消の確認',
    description: 'この書籍の返却申請を取り消します。よろしいですか？',
    confirmLabel: '申請を取り消す',
    nextStatus: '貸出中',
    message: '返却申請を取り消しました。',
  },
  approveReturn: {
    title: '返却承認',
    description: 'この書籍の返却を承認します。',
    confirmLabel: '承認する',
    nextStatus: '貸出可',
    message: '返却を承認しました。',
  },
}

const actionConfirmationPrompts: Record<BookAction, string> = {
  reserve: '上記の書籍を予約しますか？',
  cancelReservation: '上記の書籍の予約を取り消しますか？',
  loan: '上記の内容で貸出を実施しますか？',
  return: '上記の内容で直接返却を実施しますか？',
  requestReturn: '上記の書籍の返却を申請しますか？',
  cancelReturnRequest: '上記の書籍の返却申請を取り消しますか？',
  approveReturn: '上記の書籍の返却を承認しますか？',
}

function formatDate(date: string) {
  return date ? date.replaceAll('-', '/') : '未設定'
}

function getActions(role: UserRole, status: LoanStatus): ActionDefinition[] {
  if (status === '貸出可') {
    if (role === 'general') {
      return [{ id: 'reserve', label: '予約', icon: <CalendarIcon /> }]
    }
    if (role === 'operator') {
      return [{ id: 'loan', label: '貸出', icon: <BookIcon /> }]
    }
    return [
      { id: 'reserve', label: '予約', icon: <CalendarIcon /> },
      { id: 'loan', label: '貸出', icon: <BookIcon /> },
    ]
  }

  if (status === '貸出中') {
    if (role === 'admin') {
      return [
        { id: 'return', label: '直接返却', icon: <ReturnIcon /> },
        { id: 'requestReturn', label: '返却申請', icon: <ReturnIcon /> },
      ]
    }
    return [{ id: 'requestReturn', label: '返却申請', icon: <ReturnIcon /> }]
  }

  if (status === '返却申請中') {
    if (role === 'admin') {
      return [
        { id: 'cancelReturnRequest', label: '返却申請取消', icon: <ReturnIcon /> },
        { id: 'approveReturn', label: '返却承認', icon: <ReturnIcon /> },
      ]
    }
    return [{ id: 'cancelReturnRequest', label: '返却申請取消', icon: <ReturnIcon /> }]
  }

  if (role === 'general') {
    return [{ id: 'cancelReservation', label: '予約取消', icon: <CalendarIcon /> }]
  }
  return [
    { id: 'loan', label: '貸出', icon: <BookIcon /> },
    { id: 'cancelReservation', label: '予約取消', icon: <CalendarIcon /> },
  ]
}

function BookDetail({
  books,
  role,
  onStatusChange,
  historyVisibility,
  onHistoryVisibilityChange,
  returnComments,
  onReturnCommentChange,
  onLogout,
}: BookDetailProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const { bookId } = useParams()
  const book = books.find((candidate) => candidate.id === bookId) ?? books[0]
  const routeMessage = (location.state as LocationState | null)?.message
  const [message, setMessage] = useState(routeMessage ?? '')
  const [pendingAction, setPendingAction] = useState<BookAction | null>(null)
  const [actionStep, setActionStep] = useState<ActionStep | null>(null)
  const [editingHistory, setEditingHistory] = useState(false)
  const [draftVisibleHistoryIds, setDraftVisibleHistoryIds] = useState<string[]>([])

  if (!book) {
    return null
  }
  if (book.collectionStatus === '廃棄' && role !== 'admin') {
    return <Navigate to="/search" replace />
  }

  const details = [
    ['書籍ID', book.id],
    ['書籍名', book.title],
    ['ISBN', book.isbn || '未設定'],
    ['著者名', book.author],
    ['カテゴリ1', book.majorCategory || '未設定'],
    ['カテゴリ2', book.minorCategory || '未設定'],
    ['出版社', book.publisher],
    ['出版日', formatDate(book.publishedAt)],
    ['配架分類', book.collectionStatus],
    ['棚番号', book.shelfNumber],
    ['段番号', book.tierNumber || '未設定'],
    ['拠点', book.location],
    ['備考', book.notes || '付録なし'],
  ]
  const actions = getActions(role, book.loanStatus)
  const visibleHistoryIds = historyVisibility[book.id] ?? loanHistory.map((history) => history.id)
  const displayedHistory = role === 'admin' && editingHistory
    ? loanHistory
    : loanHistory.filter((history) => visibleHistoryIds.includes(history.id))
  const menuItems = [
    { id: 'mypage', label: 'マイページ', description: '利用状況を確認する' },
    { id: 'search', label: '書籍検索', description: '蔵書を条件検索する' },
    ...(role === 'admin'
      ? [{ id: 'create', label: '書籍登録', description: '新しい書籍を登録する' }]
      : []),
    { id: 'system', label: 'システムメニュー', description: '最初のメニューへ戻る' },
    { id: 'logout', label: 'ログアウト', description: 'ログイン画面へ戻る' },
  ]

  const executeAction = (action: BookAction) => {
    const setting = actionSettings[action]
    onStatusChange(book.id, setting.nextStatus)
    setMessage(setting.message)
    setPendingAction(null)
    setActionStep(null)
  }

  const startHistoryEditing = () => {
    setDraftVisibleHistoryIds(visibleHistoryIds)
    setEditingHistory(true)
  }

  const toggleHistoryVisibility = (historyId: string) => {
    setDraftVisibleHistoryIds((current) => (
      current.includes(historyId)
        ? current.filter((id) => id !== historyId)
        : [...current, historyId]
    ))
  }

  const saveHistoryVisibility = () => {
    onHistoryVisibilityChange(book.id, draftVisibleHistoryIds)
    setEditingHistory(false)
    setMessage('貸出履歴の表示設定を更新しました。')
  }

  const requiresEmployeeId = (action: BookAction) => (
    (role === 'operator'
      && ['loan', 'requestReturn', 'cancelReturnRequest'].includes(action))
    || (role === 'admin'
      && ['loan', 'return', 'requestReturn'].includes(action))
  )
  const requiresPassword = (action: BookAction) => (
    role === 'operator'
    && ['loan', 'requestReturn', 'cancelReturnRequest'].includes(action)
  )
  const startAction = (action: BookAction) => {
    setPendingAction(action)
    if (action === 'approveReturn') {
      setActionStep('approval')
    } else if (requiresEmployeeId(action)) {
      setActionStep('auth')
    } else if (action === 'requestReturn') {
      setActionStep('returnRequest')
    } else {
      setActionStep('confirm')
    }
  }

  const closeAction = () => {
    setPendingAction(null)
    setActionStep(null)
  }

  const finishAuthentication = (action: BookAction) => {
    setActionStep(action === 'requestReturn' ? 'returnRequest' : 'confirm')
  }

  const submitReturnRequest = (comment: string) => {
    onReturnCommentChange(book.id, comment)
    executeAction('requestReturn')
  }

  const rejectReturnRequest = () => {
    onStatusChange(book.id, '貸出中')
    onReturnCommentChange(book.id, '')
    setMessage('返却申請を却下しました。')
    closeAction()
  }

  const handleMenu = (id: string) => {
    if (id === 'mypage') navigate('/mypage')
    if (id === 'search') navigate('/search')
    if (id === 'create') navigate('/create')
    if (id === 'system') navigate('/')
    if (id === 'logout') {
      onLogout()
      navigate('/login', { replace: true })
    }
  }

  const statusDescription = {
    貸出可: <p>現在、この書籍は貸出できます。</p>,
    貸出中: (
      <>
        <p>貸出者：○○さん</p>
        <p>返却予定日：2026/04/10</p>
      </>
    ),
    返却申請中: (
      <>
        <p>貸出者：○○さん</p>
        <p>返却申請を確認中です。</p>
      </>
    ),
    予約中: (
      <>
        <p>予約者：○○さん</p>
        <p>予約日：2026/04/01</p>
      </>
    ),
  }[book.loanStatus]

  const modalSetting = pendingAction ? actionSettings[pendingAction] : null
  const confirmationTitle = pendingAction === 'loan'
    ? '貸出確認'
    : pendingAction === 'return'
      ? '直接返却確認'
      : modalSetting?.title ?? ''
  const personLabel = role === 'general' ? '山田 太郎さん' : '山田太郎さん'

  return (
    <main className="page-shell detail-page">
      <header className="page-header detail-header">
        <BackButton label="前の画面に戻る" onClick={() => navigate('/search')} />
        <h1>書籍詳細画面</h1>
        <div className="detail-header-actions">
          {role === 'admin' && (
            <Link className="edit-button" to={`/books/${book.id}/edit`}>
              <EditIcon />
              書籍編集
            </Link>
          )}
          <UserMenu role={role} items={menuItems} onSelect={(item) => handleMenu(item.id)} />
        </div>
      </header>

      <section className="detail-card">
        <div className="book-information">
          <h2 className="section-title"><BookIcon />書籍情報</h2>
          <dl className="detail-list">
            {details.map(([label, value]) => (
              <div className="detail-row" key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="book-actions-panel">
          <h2 className="section-title">現在の状態</h2>
          <div className={`loan-status status-${book.loanStatus}`}>
            <span className="loan-status-icon"><BookIcon size={34} /></span>
            <div>
              <strong>{book.loanStatus}</strong>
              {statusDescription}
            </div>
          </div>

          <div className="detail-actions">
            {actions.map((action) => (
              <button key={action.id} type="button" onClick={() => startAction(action.id)}>
                {action.icon}
                {action.label}
              </button>
            ))}
          </div>
        </div>

        <div className="loan-history">
          <div className="loan-history-heading">
            <h2 className="section-title"><ClockIcon />貸出履歴</h2>
            {role === 'admin' && (
              <div className="history-edit-actions">
                {editingHistory ? (
                  <>
                    <button
                      type="button"
                      className="history-button secondary"
                      onClick={() => setEditingHistory(false)}
                    >
                      キャンセル
                    </button>
                    <button type="button" className="history-button primary" onClick={saveHistoryVisibility}>
                      更新
                    </button>
                  </>
                ) : (
                  <button type="button" className="history-button" onClick={startHistoryEditing}>
                    <EditIcon size={20} />編集
                  </button>
                )}
              </div>
            )}
          </div>
          {editingHistory && (
            <p className="history-edit-guidance">
              チェックした履歴が詳細画面に表示されます。非表示中の履歴を含め、全件を表示しています。
            </p>
          )}
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  {editingHistory && <th>表示</th>}
                  <th>貸出ID</th>
                  <th>貸出者</th>
                  <th>貸出日</th>
                  <th>返却日</th>
                  <th>感想</th>
                </tr>
              </thead>
              <tbody>
                {displayedHistory.map((loan) => (
                  <tr
                    key={loan.id}
                    className={
                      editingHistory && !draftVisibleHistoryIds.includes(loan.id)
                        ? 'history-hidden-row'
                        : ''
                    }
                  >
                    {editingHistory && (
                      <td>
                        <input
                          type="checkbox"
                          aria-label={`${loan.id}を表示`}
                          checked={draftVisibleHistoryIds.includes(loan.id)}
                          onChange={() => toggleHistoryVisibility(loan.id)}
                        />
                      </td>
                    )}
                    <td>{loan.id}</td>
                    <td>{loan.borrower}</td>
                    <td>{loan.loanDate}</td>
                    <td>{loan.returnDate}</td>
                    <td>{loan.comment}</td>
                  </tr>
                ))}
                {displayedHistory.length === 0 && (
                  <tr>
                    <td colSpan={editingHistory ? 6 : 5} className="empty-history">
                      表示する貸出履歴はありません。
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {pendingAction && modalSetting && actionStep === 'auth' && (
        <BookActionModal
          open
          title={modalSetting.title}
          description={modalSetting.description}
          confirmLabel="内容を確認"
          requireEmployeeId={requiresEmployeeId(pendingAction)}
          requirePassword={requiresPassword(pendingAction)}
          onClose={closeAction}
          onConfirm={() => finishAuthentication(pendingAction)}
        />
      )}
      {pendingAction && modalSetting && actionStep === 'confirm' && (
        <ActionConfirmationModal
          open
          title={confirmationTitle}
          personLabel={personLabel}
          bookTitle={book.title}
          returnDueDate={pendingAction === 'loan' ? getReturnDueDate() : undefined}
          prompt={actionConfirmationPrompts[pendingAction]}
          confirmLabel="確定"
          onClose={closeAction}
          onConfirm={() => executeAction(pendingAction)}
        />
      )}
      {pendingAction === 'requestReturn' && actionStep === 'returnRequest' && (
        <ReturnRequestModal
          open
          initialComment={returnComments[book.id] ?? ''}
          onClose={closeAction}
          onConfirm={submitReturnRequest}
        />
      )}
      {pendingAction === 'approveReturn' && actionStep === 'approval' && (
        <ModalDialog
          open
          title="返却承認確認"
          confirmLabel="返却を承認"
          secondaryActionLabel="却下"
          maxWidth="sm"
          onClose={closeAction}
          onConfirm={() => executeAction('approveReturn')}
          onSecondaryAction={rejectReturnRequest}
        >
          <div className="return-approval-confirmation">
            <dl>
              <div><dt>申請者：</dt><dd>山田太郎さん</dd></div>
              <div><dt>書籍名：</dt><dd>{book.title}</dd></div>
            </dl>
            <div className="return-comment-preview">
              <strong>返却申請時の感想</strong>
              <p>{returnComments[book.id] || '感想は入力されていません。'}</p>
            </div>
            <p>内容を確認し、返却申請の承認または却下を選択してください。</p>
          </div>
        </ModalDialog>
      )}
      <Toast open={Boolean(message)} message={message} severity="success" onClose={() => setMessage('')} />
    </main>
  )
}

export default BookDetail

import { useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  BookIcon,
  BookmarkIcon,
  ClockIcon,
  PlusIcon,
  SearchIcon,
  UserIcon,
  UsersIcon,
} from '../../Icons'
import {
  ActionConfirmationModal,
  BackButton,
  BookActionModal,
  DropdownField,
  ModalDialog,
  ReturnRequestModal,
  TextBox,
  Toast,
  UserMenu,
} from '../../components'
import { useLibraryDataValue } from '../../data/libraryQueries'
import { getCurrentDate, getReturnDueDate } from '../../dateUtils'
import type {
  BorrowingRecord,
  ReservationRecord,
  UserLoanHistory,
  UserRole,
} from '../../types'

type MyPageProps = {
  role: UserRole
  onLogout: () => void
}

type GeneralPendingAction = 'requestReturn' | 'cancelReservation'
type LoanStep = 'auth' | 'confirm'

type AccordionPanelProps = {
  title: string
  tone?: 'blue' | 'orange'
  icon: ReactNode
  defaultOpen?: boolean
  children: ReactNode
}

function AccordionPanel({
  title,
  tone = 'blue',
  icon,
  defaultOpen = false,
  children,
}: AccordionPanelProps) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <section className={`mypage-section accordion-section ${tone}`}>
      <button type="button" className="accordion-heading" onClick={() => setOpen((current) => !current)}>
        <span>{icon}{title}</span>
        <span className={`accordion-chevron ${open ? 'open' : ''}`}>⌄</span>
      </button>
      {open && <div className="accordion-content">{children}</div>}
    </section>
  )
}

function MyPage({ role, onLogout }: MyPageProps) {
  const navigate = useNavigate()
  const data = useLibraryDataValue()
  const profile = data.roleProfiles[role]
  const generalReservation = data.reservationRecords[0]
  const [borrowings, setBorrowings] = useState<BorrowingRecord[]>(data.borrowingRecords)
  const [reservations, setReservations] = useState<ReservationRecord[]>(data.reservationRecords)
  const [pendingLoan, setPendingLoan] = useState<ReservationRecord | null>(null)
  const [loanStep, setLoanStep] = useState<LoanStep | null>(null)
  const [pendingGeneralAction, setPendingGeneralAction] = useState<GeneralPendingAction | null>(null)
  const [pendingApproval, setPendingApproval] = useState<BorrowingRecord | null>(null)
  const [hasReservation, setHasReservation] = useState(true)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [filterKey, setFilterKey] = useState('employeeNumber')
  const [keyword, setKeyword] = useState('')
  const [message, setMessage] = useState('')
  const visibleLoanHistory = data.userLoanHistory.filter((record) => {
    if (role === 'admin') return true
    return data.books.find((book) => book.id === record.bookId)?.collectionStatus !== '廃棄'
  })

  const filteredBorrowings = useMemo(() => {
    const normalized = keyword.trim().toLowerCase()
    if (!normalized) return borrowings
    return borrowings.filter((record) => {
      const target = filterKey === 'name'
        ? record.borrower
        : filterKey === 'title'
          ? record.title
          : record.employeeNumber
      return target.toLowerCase().includes(normalized)
    })
  }, [borrowings, filterKey, keyword])

  const menuItems = [
    { id: 'system', label: 'システムメニュー', description: '最初のメニューへ戻る' },
    { id: 'search', label: '書籍検索', description: '蔵書を条件検索する' },
    ...(role === 'admin'
      ? [{ id: 'create', label: '書籍登録', description: '新しい書籍を登録する' }]
      : []),
    { id: 'logout', label: 'ログアウト', description: 'ログイン画面へ戻る' },
  ]

  const toggleSelected = (id: string) => {
    setSelectedIds((current) => (
      current.includes(id)
        ? current.filter((selectedId) => selectedId !== id)
        : [...current, id]
    ))
  }

  const approveReturn = (employeeNumber: string) => {
    setBorrowings((current) => current.filter((record) => record.employeeNumber !== employeeNumber))
    setSelectedIds((current) => current.filter((selectedId) => selectedId !== employeeNumber))
    setMessage('返却を承認しました。')
    setPendingApproval(null)
  }

  const rejectReturn = (employeeNumber: string) => {
    setBorrowings((current) => current.map((record) => (
      record.employeeNumber === employeeNumber
        ? { ...record, status: '貸出中', returnComment: undefined }
        : record
    )))
    setMessage('返却申請を却下しました。')
    setPendingApproval(null)
  }

  const bulkReturn = () => {
    if (selectedIds.length === 0) {
      setMessage('返却する行を選択してください。')
      return
    }
    setBorrowings((current) => current.filter((record) => !selectedIds.includes(record.employeeNumber)))
    setMessage(`${selectedIds.length}件の一括返却登録を受け付けました。`)
    setSelectedIds([])
  }

  const requestReturn = (comment: string) => {
    setBorrowings((current) => current.map((record) => (
      record.employeeNumber === profile.employeeNumber
        ? { ...record, status: '返却申請中', returnComment: comment }
        : record
    )))
    setMessage('返却申請を受け付けました。')
    setPendingGeneralAction(null)
  }

  const cancelReservation = () => {
    setHasReservation(false)
    setMessage('予約を取り消しました。')
    setPendingGeneralAction(null)
  }

  const loanReservedBook = () => {
    if (!pendingLoan) return

    setReservations((current) => current.filter((record) => record !== pendingLoan))
    setBorrowings((current) => [
      ...current,
      {
        employeeNumber: pendingLoan.employeeNumber,
        borrower: pendingLoan.reserver,
        title: pendingLoan.title,
        author: pendingLoan.author,
        loanDate: getCurrentDate(),
        shelfNumber: pendingLoan.shelfNumber,
        tierNumber: pendingLoan.tierNumber,
        status: '貸出中',
      },
    ])
    setMessage(`${pendingLoan.reserver}さんへの貸出を登録しました。`)
    setPendingLoan(null)
    setLoanStep(null)
  }

  const startLoan = (record: ReservationRecord) => {
    setPendingLoan(record)
    setLoanStep('auth')
  }

  const closeLoanFlow = () => {
    setPendingLoan(null)
    setLoanStep(null)
  }

  const logout = () => {
    onLogout()
    navigate('/login', { replace: true })
  }

  const handleMenu = (id: string) => {
    if (id === 'system') navigate('/')
    if (id === 'search') navigate('/search')
    if (id === 'create') navigate('/create')
    if (id === 'logout') logout()
  }

  return (
    <main className="page-shell mypage">
      <div className="mypage-nav">
        <BackButton label="メニューへ戻る" onClick={() => navigate('/')} />
        <UserMenu
          role={role}
          items={menuItems}
          onSelect={(item) => handleMenu(item.id)}
        />
      </div>

      <h1 className="standalone-title">マイページ</h1>

      <section className="user-card">
        <span className="user-avatar">
          {role === 'general' ? <UserIcon size={46} /> : <UsersIcon size={46} />}
        </span>
        <h2>{profile.title}</h2>
        <div className="user-meta">
          <p>ユーザーID：{profile.userId}</p>
          <p>名前：{profile.name}</p>
        </div>
        <span className={`role-chip ${role}`}>{profile.label}</span>
      </section>

      <div className="mypage-primary-actions">
        <button type="button" className="outline-action search-action" onClick={() => navigate('/search')}>
          <SearchIcon />書籍検索
        </button>
        {role === 'admin' && (
          <button type="button" className="outline-action" onClick={() => navigate('/create')}>
            <PlusIcon />書籍登録
          </button>
        )}
      </div>

      {role === 'general' && (
        <GeneralUserSections
          borrowing={borrowings.find((record) => record.employeeNumber === profile.employeeNumber)}
          reservation={generalReservation}
          hasReservation={hasReservation}
          onRequestReturn={() => setPendingGeneralAction('requestReturn')}
          onCancelReservation={() => setPendingGeneralAction('cancelReservation')}
          historyRecords={visibleLoanHistory}
          onOpenBook={(bookId) => navigate(`/books/${bookId}`, {
            state: { from: '/mypage' },
          })}
        />
      )}

      {role === 'operator' && (
        <div className="operator-accordions">
          <AccordionPanel title="借受リスト（全員分）" icon={<BookIcon />}>
            <SimpleBorrowingTable records={borrowings} />
          </AccordionPanel>
          <AccordionPanel title="予約リスト（全員分）" tone="orange" icon={<BookmarkIcon />}>
            <ReservationTable records={reservations} onLoan={startLoan} />
          </AccordionPanel>
          <AccordionPanel title="貸出履歴（全員分）" icon={<ClockIcon />}>
            <HistoryTable records={visibleLoanHistory} />
          </AccordionPanel>
        </div>
      )}

      {role === 'admin' && (
        <>
          <section className="mypage-section admin-borrowings">
            <h2 className="mypage-section-title"><BookIcon />借受リスト（全員分）</h2>
            <div className="admin-filter">
              <DropdownField
                label="検索対象"
                value={filterKey}
                onChange={setFilterKey}
                options={[
                  { value: 'employeeNumber', label: '社員番号' },
                  { value: 'name', label: '借受人名' },
                  { value: 'title', label: '書籍名' },
                ]}
              />
              <TextBox label="キーワード" value={keyword} onChange={setKeyword} placeholder="キーワードを入力" />
              <button
                type="button"
                className="compact-search"
                onClick={() => setMessage(`${filteredBorrowings.length}件見つかりました。`)}
              >
                <SearchIcon size={19} />検索
              </button>
            </div>
            <div className="table-scroll">
              <table className="data-table admin-table">
                <thead>
                  <tr>
                    <th aria-label="選択" />
                    <th>社員番号</th>
                    <th>借受人名</th>
                    <th>書籍名</th>
                    <th>著者</th>
                    <th>貸出日付</th>
                    <th>棚番号</th>
                    <th>段番号</th>
                    <th>状態</th>
                    <th>操作</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBorrowings.map((record) => (
                    <tr
                      key={record.employeeNumber}
                      className={selectedIds.includes(record.employeeNumber) ? 'selected' : ''}
                    >
                      <td>
                        <input
                          type="checkbox"
                          aria-label={`${record.borrower}を選択`}
                          checked={selectedIds.includes(record.employeeNumber)}
                          onChange={() => toggleSelected(record.employeeNumber)}
                        />
                      </td>
                      <td>{record.employeeNumber}</td>
                      <td>{record.borrower}</td>
                      <td>{record.title}</td>
                      <td>{record.author}</td>
                      <td>{record.loanDate}</td>
                      <td>{record.shelfNumber}</td>
                      <td>{record.tierNumber}</td>
                      <td><RecordStatus status={record.status} /></td>
                      <td>
                        {record.status === '返却申請中' ? (
                          <button
                            type="button"
                            className="list-action-button approve"
                            onClick={() => setPendingApproval(record)}
                          >
                            返却承認
                          </button>
                        ) : '−'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button type="button" className="bulk-return-button" onClick={bulkReturn}>
              <BookIcon size={21} />一括返却登録
            </button>
          </section>

          <div className="operator-accordions admin-secondary-lists">
            <AccordionPanel title="予約リスト（全員分）" tone="orange" icon={<BookmarkIcon />}>
              <ReservationTable records={reservations} />
            </AccordionPanel>
            <AccordionPanel title="貸出履歴（全員分）" icon={<ClockIcon />}>
              <HistoryTable records={visibleLoanHistory} />
            </AccordionPanel>
          </div>
        </>
      )}

      {pendingLoan && loanStep === 'auth' && (
        <BookActionModal
          open
          title="予約書籍の貸出"
          description={`${pendingLoan.reserver}さんへ「${pendingLoan.title}」を貸し出します。`}
          confirmLabel="内容を確認"
          requireEmployeeId
          requirePassword
          onClose={closeLoanFlow}
          onConfirm={() => setLoanStep('confirm')}
        />
      )}
      {pendingLoan && loanStep === 'confirm' && (
        <ActionConfirmationModal
          open
          title="貸出確認"
          personLabel={`${pendingLoan.reserver}さん`}
          bookTitle={pendingLoan.title}
          returnDueDate={getReturnDueDate()}
          prompt="上記の内容で貸出を実施しますか？"
          onClose={closeLoanFlow}
          onConfirm={loanReservedBook}
        />
      )}
      {pendingGeneralAction === 'requestReturn' && (
        <ReturnRequestModal
          open
          onClose={() => setPendingGeneralAction(null)}
          onConfirm={requestReturn}
        />
      )}
      {pendingGeneralAction === 'cancelReservation' && (
        <ActionConfirmationModal
          open
          title="予約取消の確認"
          personLabel={`${profile.name}さん`}
          bookTitle={generalReservation?.title ?? ''}
          prompt="上記の書籍の予約を取り消しますか？"
          confirmLabel="予約を取り消す"
          onClose={() => setPendingGeneralAction(null)}
          onConfirm={cancelReservation}
        />
      )}
      {pendingApproval && (
        <ModalDialog
          open
          title="返却承認確認"
          confirmLabel="返却を承認"
          secondaryActionLabel="却下"
          maxWidth="sm"
          onClose={() => setPendingApproval(null)}
          onConfirm={() => approveReturn(pendingApproval.employeeNumber)}
          onSecondaryAction={() => rejectReturn(pendingApproval.employeeNumber)}
        >
          <div className="return-approval-confirmation">
            <dl>
              <div><dt>申請者：</dt><dd>{pendingApproval.borrower}さん</dd></div>
              <div><dt>書籍名：</dt><dd>{pendingApproval.title}</dd></div>
            </dl>
            <div className="return-comment-preview">
              <strong>返却申請時の感想</strong>
              <p>{pendingApproval.returnComment || '感想は入力されていません。'}</p>
            </div>
            <p>内容を確認し、返却申請の承認または却下を選択してください。</p>
          </div>
        </ModalDialog>
      )}
      <Toast open={Boolean(message)} message={message} severity="success" onClose={() => setMessage('')} />
    </main>
  )
}

type GeneralUserSectionsProps = {
  borrowing?: BorrowingRecord
  reservation?: ReservationRecord
  hasReservation: boolean
  onRequestReturn: () => void
  onCancelReservation: () => void
  historyRecords: UserLoanHistory[]
  onOpenBook: (bookId: string) => void
}

function GeneralUserSections({
  borrowing,
  reservation,
  hasReservation,
  onRequestReturn,
  onCancelReservation,
  historyRecords,
  onOpenBook,
}: GeneralUserSectionsProps) {
  return (
    <>
      <section className="mypage-section">
        <h2 className="mypage-section-title"><BookIcon />貸出予約リスト</h2>
        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr><th>書籍名</th><th>著者</th><th>利用日付</th><th>棚番号</th><th>段番号</th><th>状態</th><th>操作</th></tr>
            </thead>
            <tbody>
              {borrowing && (
                <tr>
                  <td>{borrowing.title}</td>
                  <td>{borrowing.author}</td>
                  <td>{borrowing.loanDate}</td>
                  <td>{borrowing.shelfNumber}</td>
                  <td>{borrowing.tierNumber}</td>
                  <td><RecordStatus status={borrowing.status} /></td>
                  <td>
                    {borrowing.status === '貸出中' ? (
                      <button type="button" className="list-action-button request" onClick={onRequestReturn}>
                        返却申請
                      </button>
                    ) : '申請済み'}
                  </td>
                </tr>
              )}
              {hasReservation && reservation && (
                <tr>
                  <td>{reservation.title}</td>
                  <td>{reservation.author}</td>
                  <td>{reservation.reservationDate}</td>
                  <td>{reservation.shelfNumber}</td>
                  <td>{reservation.tierNumber}</td>
                  <td><span className="record-status reserved">予約中</span></td>
                  <td>
                    <button type="button" className="list-action-button cancel" onClick={onCancelReservation}>
                      予約取消
                    </button>
                  </td>
                </tr>
              )}
              {!borrowing && !hasReservation && (
                <tr><td colSpan={7}>現在の貸出・予約はありません。</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mypage-section">
        <h2 className="mypage-section-title"><ClockIcon />貸出履歴</h2>
        <div className="table-scroll">
          <table className="data-table">
            <thead><tr><th>書籍名</th><th>著者</th><th>貸出日付</th><th>返却日</th><th>詳細</th></tr></thead>
            <tbody>
              {historyRecords.map((record) => (
                <tr key={record.title}>
                  <td>{record.title}</td>
                  <td>{record.author}</td>
                  <td>{record.loanDate}</td>
                  <td>{record.returnDate}</td>
                  <td>
                    <button
                      type="button"
                      className="row-detail"
                      onClick={() => onOpenBook(record.bookId)}
                    >
                      ›
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  )
}

function RecordStatus({ status }: { status: BorrowingRecord['status'] }) {
  return (
    <span className={`record-status ${status === '返却申請中' ? 'returning' : ''}`}>
      {status}
    </span>
  )
}

function SimpleBorrowingTable({ records }: { records: BorrowingRecord[] }) {
  return (
    <div className="table-scroll">
      <table className="data-table">
        <thead>
          <tr><th>書籍名</th><th>著者</th><th>借受者</th><th>貸出日付</th><th>棚番号</th><th>段番号</th><th>状態</th></tr>
        </thead>
        <tbody>
          {records.map((record) => (
            <tr key={record.employeeNumber}>
              <td>{record.title}</td>
              <td>{record.author}</td>
              <td>{record.borrower}</td>
              <td>{record.loanDate}</td>
              <td>{record.shelfNumber}</td>
              <td>{record.tierNumber}</td>
              <td><RecordStatus status={record.status} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function ReservationTable({
  records,
  onLoan,
}: {
  records: ReservationRecord[]
  onLoan?: (record: ReservationRecord) => void
}) {
  return (
    <div className="table-scroll">
      <table className="data-table">
        <thead>
          <tr>
            <th>書籍名</th><th>著者</th><th>予約者</th><th>予約日付</th><th>棚番号</th><th>段番号</th>
            {onLoan && <th>操作</th>}
          </tr>
        </thead>
        <tbody>
          {records.map((record) => (
            <tr key={`${record.title}-${record.reserver}`}>
              <td>{record.title}</td>
              <td>{record.author}</td>
              <td>{record.reserver}</td>
              <td>{record.reservationDate}</td>
              <td>{record.shelfNumber}</td>
              <td>{record.tierNumber}</td>
              {onLoan && (
                <td>
                  <button
                    type="button"
                    className="list-action-button loan"
                    onClick={() => onLoan(record)}
                  >
                    貸出
                  </button>
                </td>
              )}
            </tr>
          ))}
          {records.length === 0 && (
            <tr><td colSpan={onLoan ? 7 : 6}>予約中の書籍はありません。</td></tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

function HistoryTable({ records }: { records: UserLoanHistory[] }) {
  return (
    <div className="table-scroll">
      <table className="data-table">
        <thead><tr><th>書籍名</th><th>著者</th><th>借受者</th><th>貸出日付</th><th>返却日</th><th>棚番号</th><th>段番号</th></tr></thead>
        <tbody>
          {records.map((record) => (
            <tr key={record.title}>
              <td>{record.title}</td>
              <td>{record.author}</td>
              <td>{record.borrower}</td>
              <td>{record.loanDate}</td>
              <td>{record.returnDate}</td>
              <td>{record.shelfNumber}</td>
              <td>{record.tierNumber}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default MyPage

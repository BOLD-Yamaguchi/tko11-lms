import { useEffect, useState } from 'react'
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
} from '../../Icons'
import {
  ActionConfirmationModal,
  BackButton,
  ModalDialog,
  ReturnRequestModal,
  Toast,
} from '../../components'
import { BookActionModal } from '../../components/modals/BookActionModal'
import type { BookActionCredentials } from '../../components'
import {
  approveBookReturn,
  cancelBookReservation,
  directlyReturnBook,
  fetchBookDetail,
  fetchHistoryListsByBookId,
  lendBook,
  rejectBookReturnRequest,
  requestBookReturn,
  reserveBook,
} from '../../api/booksApi'
import { libraryDataQueryKey,useLibraryDataValue } from '../../data/libraryQueries'
import { getCurrentDate, getReturnDueDate } from '../../dateUtils'
import type { BookSearchState } from '../book-search/searchState'
import type { BookStatusDetail, LoanStatus} from '../../types'
import { UserRole } from '../../types'
import { useQueryClient } from '@tanstack/react-query';
import { API_BASE_URL } from '../../constants/api'
import { fetchUsers } from '../../api/usersApi'

type BookDetailProps = {
  onStatusChange: (
    bookId: string,
    status: LoanStatus,
    statusDetail?: BookStatusDetail | null,
  ) => void
  onHistoryVisibilityChange: (bookId: string, visibleIds: string[]) => void
  onReturnCommentChange: (bookId: string, comment: string) => void
  onLogout: () => void
}

type LocationState = {
  message?: string
  from?: '/mypage' | '/search'
  searchState?: BookSearchState
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
    if (role === UserRole.General) {
      return [{ id: 'reserve', label: '予約', icon: <CalendarIcon /> }]
    }
    if (role === UserRole.Operator) {
      return [{ id: 'loan', label: '貸出', icon: <BookIcon /> }]
    }
    return [{ id: 'loan', label: '貸出', icon: <BookIcon /> }]
  }

  if (status === '貸出中') {
    if (role === UserRole.Admin) {
      return [
        { id: 'return', label: '直接返却', icon: <ReturnIcon /> },
        { id: 'requestReturn', label: '返却申請', icon: <ReturnIcon /> },
      ]
    }
    return [{ id: 'requestReturn', label: '返却申請', icon: <ReturnIcon /> }]
  }

  if (status === '返却申請中') {
    if (role === UserRole.Admin) {
      return [
        { id: 'cancelReturnRequest', label: '返却申請取消', icon: <ReturnIcon /> },
        { id: 'approveReturn', label: '返却承認', icon: <ReturnIcon /> },
      ]
    }
    return [{ id: 'cancelReturnRequest', label: '返却申請取消', icon: <ReturnIcon /> }]
  }

  if (role === UserRole.General) {
    return [{ id: 'cancelReservation', label: '予約取消', icon: <CalendarIcon /> }]
  }
  return [
    { id: 'loan', label: '貸出', icon: <BookIcon /> },
    { id: 'cancelReservation', label: '予約取消', icon: <CalendarIcon /> },
  ]
}

function BookDetail({
  onStatusChange,
  onHistoryVisibilityChange,
  onReturnCommentChange,
}: BookDetailProps) {
  const [historyList, setHistoryList] = useState<any[]>([])

  const navigate = useNavigate()
  const location = useLocation()
  const role = Number(sessionStorage.getItem("adminKbn")) as UserRole
  const data = useLibraryDataValue()
  const books = data.books
  const historyVisibility = data.historyVisibility
  const returnComments = data.returnComments
  const { bookId } = useParams()
  const book = books.find((candidate) => candidate.id === bookId) ?? books[0]
  const locationState = location.state as LocationState | null
  const routeMessage = locationState?.message
  const backPath = locationState?.from === '/mypage' ? '/mypage' : '/search'
  
  const [message, setMessage] = useState(routeMessage ?? '')
  const [toastSeverity, setToastSeverity] = useState<'success' | 'error'>('success');
  const [pendingAction, setPendingAction] = useState<BookAction | null>(null)
  const [actionStep, setActionStep] = useState<ActionStep | null>(null)
  const [authenticatedUserName, setAuthenticatedUserName] = useState('')
  const [authenticatedEmployeeCode, setAuthenticatedEmployeeCode] = useState('')
  const [editingHistory, setEditingHistory] = useState(false)
  const [draftVisibleHistoryIds, setDraftVisibleHistoryIds] = useState<string[]>([])
  const queryClient = useQueryClient();
  
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.key])

  useEffect(() => {
    if (!book?.id) return

    void fetchBookDetail(book.id)
  
    fetchHistoryListsByBookId(book.id)
      .then((res) => {
        setHistoryList(res ?? [])
      })
      .catch((err) => {
        console.error('履歴の取得に失敗しました', err)
      })
  }, [book?.id])

  if (!book) {
    return null
  }
  if (book.collectionStatus === '廃棄' && role !== UserRole.Admin) {
    return <Navigate to="/search" replace />
  }
  const isDisposed = book.collectionStatus === '廃棄'

  const details = [
    ['書籍ID', book.id],
    ['書籍名', book.title],
    ['ISBN', book.isbn || '未設定'],
    ['著者名', book.author],
    ['大分類', book.majorCategory],
    ['中分類', book.minorCategory || '未設定'],
    ['出版社', book.publisher],
    ['出版日', formatDate(book.publishedAt)],
    ['配架分類', book.collectionStatus],
    ['棚番号', book.shelfNumber],
    ['段番号', book.tierNumber || '未設定'],
    ['拠点', book.location],
    ['備考', book.notes],
  ]
  const actions = isDisposed ? [] : getActions(role, book.loanStatus)

  const getLoggedInUser = () => {
    try {
      const userJson = localStorage.getItem('user') || localStorage.getItem('loginUser')
      if (userJson) {
        const parsed = JSON.parse(userJson)
        if (parsed.employeeCode || parsed.employeeId) {
          return {
            userId: parsed.userId || parsed.id || "00000000-0000-0000-0000-000000000001",
            employeeCode: parsed.employeeCode || parsed.employeeId,
            name: parsed.username || parsed.userName || parsed.name || ''
          }
        }
      }
    } catch (e) {}

    const savedCode =
      sessionStorage.getItem('employeeCode') ||
      localStorage.getItem('employeeCode') ||
      localStorage.getItem('employeeId')

    const savedName =
      sessionStorage.getItem('username') ||
      localStorage.getItem('username') ||
      localStorage.getItem('userName') ||
      localStorage.getItem('name')

    const savedUid =
      sessionStorage.getItem('userId') ||
      localStorage.getItem('userId')

    if (savedCode || savedName) {
      return {
        userId: savedUid || "00000000-0000-0000-0000-000000000001",
        employeeCode: savedCode || '',
        name: savedName || ''
      }
    }
    return null
  }

  const getProfile = () => {
    const masterProfile = data?.roleProfiles?.[role] as any;
    const loggedIn = getLoggedInUser() as any;

    const foundName = loggedIn?.name || masterProfile?.['username'] || masterProfile?.['name'] || masterProfile?.['userName'];

    if (foundName && foundName.trim() !== '' && foundName !== '利用者') {
      return {
        userId: loggedIn?.['userId'] || masterProfile?.['userId'] || masterProfile?.['id'] || "00000000-0000-0000-0000-000000000001",
        employeeCode: loggedIn?.['employeeCode'] || masterProfile?.['employeeCode'] || masterProfile?.['employeeId'] || '',
        name: foundName
      };
    }

    return {
      userId: loggedIn?.userId ?? "00000000-0000-0000-0000-000000000001",
      employeeCode: loggedIn?.employeeCode ?? '',
      name: loggedIn?.name ?? ''
    }
  }

  const profile = getProfile()

  const statusDetail = data?.bookStatusDetails[book.id]
  const currentBorrowingRecord = data.borrowingRecords.find((record) => record.bookId === book.id)
  const currentReservationRecord = data.reservationRecords.find((record) => record.bookId === Number(book.id))
  const displayedBorrowerName = currentBorrowingRecord?.borrower || statusDetail?.borrowerName || '不明'
  const displayedReturnComment = currentBorrowingRecord?.returnComment || ''
  const displayedReserverName = currentReservationRecord?.reserver || statusDetail?.reserverName || '不明'

  const canCancelReservation = role !== UserRole.General || currentReservationRecord?.employeeCode === profile?.employeeCode
  const canOperateReturn = role !== UserRole.General || currentBorrowingRecord?.employeeCode === profile?.employeeCode
  const displayedActions = actions.filter((action) => {
    if (action.id === 'cancelReservation') {
      return canCancelReservation
    }

    if (
      action.id === 'requestReturn' ||
      action.id === 'cancelReturnRequest'
    ) {
      return canOperateReturn
    }

    return true
  })

  // 💡 修正：APIレスポンスのキー名（lendId, updatedAtなど）と紐付ける
  const returnedHistory = historyList.filter((history) => history.updatedAt && history.updatedAt.trim())
  const visibleHistoryIds = historyVisibility[book.id] ?? returnedHistory.map((history) => String(history.lendId))
  const displayedHistory = role === UserRole.Admin && editingHistory
    ? returnedHistory
    : returnedHistory.filter((history) => visibleHistoryIds.includes(String(history.lendId)))

  const callBookActionApi = async (
    action: BookAction,
    payload: Record<string, unknown> = {},
  ) => {
    const requestPayload = {
      bookId: book.id,
      bookTitle: book.title,
      ...(action === 'reserve'
        ? {
          userId: profile?.userId,
          employeeCode: profile?.employeeCode,
          userName: profile?.name,
        }
        : {}),

      ...(action === 'cancelReservation'
        ? {
            employeeCode: profile?.employeeCode,
          }
        : {}),

      ...payload,
    }

    if (action === 'reserve') return reserveBook(requestPayload)
    if (action === 'cancelReservation') return cancelBookReservation(requestPayload)
    if (action === 'loan') return lendBook(requestPayload)
    if (action === 'return') return directlyReturnBook(requestPayload)
    if (action === 'requestReturn') return requestBookReturn(requestPayload)
    if (action === 'cancelReturnRequest') return rejectBookReturnRequest(requestPayload)
    if (action === 'approveReturn') return approveBookReturn(requestPayload)
  }

  const executeAction = async (
    action: BookAction,
    payload: Record<string, unknown> = {},
  ) => {
    const setting = actionSettings[action]
    let finalPayload = { ...payload }

    if (action === 'reserve') {
      finalPayload = {
        ...payload,
        userId: profile?.userId || "00000000-0000-0000-0000-000000000001",
        employeeCode: profile?.employeeCode,
        userName: profile?.name,
      }
    } else if (action === 'cancelReturnRequest') {
      finalPayload = {
        ...payload,
        employeeCode: profile?.employeeCode,
        userName: profile?.name,
      }
    } else if (
      role === UserRole.General &&
      action === 'requestReturn'
    ) {
      finalPayload = {
        ...payload,
        employeeCode: profile?.employeeCode,
        userName: profile?.name,
      }
    } else if (
      ['loan', 'return', 'requestReturn'].includes(action)
    ) {
      finalPayload = {
        ...payload,
        employeeCode: authenticatedEmployeeCode,
        userName: authenticatedUserName,
      }
    }

    const nextStatusDetail = getNextStatusDetail(action)

    try {
      await callBookActionApi(action, finalPayload)

      await queryClient.invalidateQueries({
        queryKey: libraryDataQueryKey,
      });
      onStatusChange(book.id, setting.nextStatus, nextStatusDetail)
      setToastSeverity('success');
      setMessage(setting.message)
      setPendingAction(null)
      setActionStep(null)
      setAuthenticatedUserName('')
      setAuthenticatedEmployeeCode('')
    } catch (error) {
      console.error(error)
      setToastSeverity('error');
      setMessage('処理に失敗しました。入力内容を確認してください。')
      setAuthenticatedEmployeeCode('')
      setAuthenticatedUserName('')
      setActionStep('auth')
    }
  }

  const getNextStatusDetail = (action: BookAction): BookStatusDetail | null | undefined => {
    if (action === 'reserve') {
      return {
        lendUserId: profile?.userId || "00000000-0000-0000-0000-000000000001",
        reserverName: profile?.name,
        reservationemployeeCode: profile?.employeeCode || '',
        reservationDate: getCurrentDate(),
      }
    }

    if (action === 'loan') {
      return {
        lendUserId: statusDetail?.lendUserId || profile?.userId || "00000000-0000-0000-0000-000000000001",
        borrowerName: authenticatedUserName || statusDetail?.reserverName || profile?.name,
        returnDueDate: getReturnDueDate(),
      }
    }

    if (['cancelReservation', 'return', 'approveReturn'].includes(action)) {
      return null
    }

    return undefined
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
    setToastSeverity('success');
    setMessage('貸出履歴の表示設定を更新しました。')
  }

  const requiresEmployeeId = (action: BookAction) => (
    (role === UserRole.Operator
      && ['loan', 'requestReturn', 'cancelReturnRequest', 'cancelReservation'].includes(action))
    || (role === UserRole.Admin
      && ['loan', 'return', 'requestReturn'].includes(action))
  )
  const requiresPassword = (action: BookAction) => (
    role === UserRole.Operator
    && ['loan', 'requestReturn', 'cancelReturnRequest', 'cancelReservation'].includes(action)
  )
  const startAction = (action: BookAction) => {
    setPendingAction(action)
    setAuthenticatedUserName('')
    setAuthenticatedEmployeeCode('')
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
    setAuthenticatedUserName('')
    setAuthenticatedEmployeeCode('')
  }

  const resolveUserName = (employeeId: string) => {
    if (employeeId === profile?.employeeCode) {
      return profile?.name
    }

    try {
      const masterUser = Object.values(data.roleProfiles || {}).find((candidate: any) => (
        candidate?.employeeCode === employeeId || candidate?.employeeId === employeeId
      ))
      if (masterUser) {
        return (masterUser as any).username || (masterUser as any).userName || (masterUser as any).name
      }
    } catch (e) {}

    return undefined
  }

  const validateActionEmployeeId = (
    employeeId: string,
  ) => {
    if (pendingAction === 'requestReturn'
      || pendingAction === 'return' 
      || pendingAction === 'cancelReturnRequest'
    ) {
      const borrowingRecord = data.borrowingRecords.find(
        (record) => record.bookId === book.id,
      );

      if (!borrowingRecord) {
        return 'この書籍の貸出情報が見つかりません。';
      }

      if (borrowingRecord.employeeCode !== employeeId) {
        return '貸出者の社員番号と一致しません。';
      }
    }

    if (pendingAction === 'cancelReservation') {
      if (!currentReservationRecord) {
        return 'この書籍の予約情報が見つかりません。'
      }

      if (currentReservationRecord.employeeCode !== employeeId) {
        return '予約者の社員番号と一致しません。'
      }
    }

    if (
      pendingAction === 'loan'
      && currentReservationRecord
      && currentReservationRecord.employeeCode !== employeeId
    ) {
      return '予約者の社員番号と一致しません。'
    }

    return undefined;
  }
  
  const finishAuthentication = async (
    action: BookAction,
    credentials: BookActionCredentials,
  ): Promise<string | undefined> => {
    let userName =
      resolveUserName(credentials.employeeId) ?? ''

    if (requiresPassword(action)) {
      try {
        const response = await fetch(
          `${API_BASE_URL}/auth/login`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              employeeCode: credentials.employeeId,
              password: credentials.password,
            }),
          },
        )

        const result = await response.json()

        if (!response.ok) {
          return result.message
            ?? '社員番号またはパスワードが違います。'
        }

        userName = result.username ?? userName
      } catch (error) {
        console.error(error)
        return '認証処理に失敗しました。'
      }
    } else if (!userName) {
      try {
        const users = await fetchUsers()
        const targetUser = users.find(
          (user) => user.employeeCode === credentials.employeeId,
        )

        if (!targetUser) {
          return '該当する社員番号の利用者が見つかりません。'
        }

        userName = targetUser.username
      } catch (error) {
        console.error(error)
        return '利用者情報の取得に失敗しました。'
      }
    }

    setAuthenticatedEmployeeCode(credentials.employeeId)
    setAuthenticatedUserName(userName)
    setActionStep(
      action === 'requestReturn'
        ? 'returnRequest'
        : 'confirm',
    )

    return undefined
  }

  const submitReturnRequest = (comment: string) => {
    onReturnCommentChange(book.id, comment)
    executeAction('requestReturn', { comment })
  }

  const rejectReturnRequest = () => {
    void rejectBookReturnRequest({
      bookId: book.id,
      bookTitle: book.title,
      comment: returnComments[book.id] ?? '',
    })
    onStatusChange(book.id, '貸出中')
    onReturnCommentChange(book.id, '')
    setToastSeverity('success');
    setMessage('返却申請を却下しました。')
    closeAction()
  }

  const goBack = () => {
    if (backPath === '/search') {
      navigate('/search', {
        state: { searchState: locationState?.searchState },
      })
      return
    }
    navigate(backPath)
  }

  const statusDescription = isDisposed
    ? <p>この書籍は廃棄済みのため、貸出・予約操作はできません。</p>
    : {
      貸出可: <p>現在、この書籍は貸出できます。</p>,
      貸出中: (
        <>
          <p>利用者：{displayedBorrowerName}さん</p>
          <p>返却予定日：{statusDetail?.returnDueDate || getReturnDueDate()}</p>
        </>
      ),
      返却申請中: (
        <>
          <p>利用者：{displayedBorrowerName}さん</p>
          <p>返却申請を確認中です。</p>
        </>
      ),
      予約中: (
        <>
          <p>予約者：{displayedReserverName}さん</p>
        </>
      ),
    }[book.loanStatus]
  const displayStatus = isDisposed ? '廃棄済' : book.loanStatus
  const statusClassName = isDisposed ? 'status-disposed' : `status-${book.loanStatus}`

  const modalSetting = pendingAction ? actionSettings[pendingAction] : null
  const confirmationTitle = pendingAction === 'loan'
    ? '貸出確認'
    : pendingAction === 'return'
      ? '直接返却確認'
      : modalSetting?.title ?? ''

  let personLabel: string | undefined

  if (pendingAction === 'cancelReservation') {
    personLabel = role === UserRole.General
      ? undefined
      : displayedReserverName
  } else if (
    pendingAction === 'return'
    || pendingAction === 'requestReturn'
    || pendingAction === 'cancelReturnRequest'
  ) {
    personLabel = displayedBorrowerName
  } else {
    personLabel = authenticatedUserName || profile?.name
  }

  return (
    <main className="page-shell detail-page">
      <header className="page-header detail-header">
        <BackButton label="前の画面に戻る" onClick={goBack} />
        <h1>書籍詳細</h1>
        <div className="detail-header-actions">
          {role === UserRole.Admin && (
            <Link className="edit-button" to={`/books/${book.id}/edit`}>
              <EditIcon />
              書籍編集
            </Link>
          )}
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
          <div className={`loan-status ${statusClassName}`}>
            <span className="loan-status-icon"><BookIcon size={34} /></span>
            <div>
              <strong>{displayStatus}</strong>
              {statusDescription}
            </div>
          </div>

          <div className="detail-actions">
            {displayedActions.map((action) => (
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
            {role === UserRole.Admin && (
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
                  <th>利用者</th>
                  <th>貸出日</th>
                  <th>返却日</th>
                  <th>感想</th>
                </tr>
              </thead>
              <tbody>
                {displayedHistory.map((loan) => {
                  const historyIdStr = String(loan.lendId)
                  return (
                    <tr
                      key={loan.lendId}
                      className={
                        editingHistory && !draftVisibleHistoryIds.includes(historyIdStr)
                          ? 'history-hidden-row'
                          : ''
                      }
                    >
                      {editingHistory && (
                        <td>
                          <input
                            type="checkbox"
                            aria-label={`${historyIdStr}を表示`}
                            checked={draftVisibleHistoryIds.includes(historyIdStr)}
                            onChange={() => toggleHistoryVisibility(historyIdStr)}
                          />
                        </td>
                      )}
                      {/* 💡 修正：APIレスポンスのプロパティ名にマッピング */}
                      <td>{loan.borrower}</td>
                      <td>{loan.createdAt ? loan.createdAt.replace('T', ' ') : '-'}</td>
                      <td>{loan.updatedAt ? loan.updatedAt.replace('T', ' ') : '貸出中'}</td>
                      <td>{loan.review || '-'}</td>
                    </tr>
                  )
                })}
                {displayedHistory.length === 0 && (
                  <tr>
                    <td colSpan={editingHistory ? 5 : 4} className="empty-history">
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
          validateEmployeeId={(employeeId) => (
            validateActionEmployeeId(employeeId)
          )}
          onClose={closeAction}
          onConfirm={(credentials) => finishAuthentication(pendingAction, credentials)}
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
          onConfirm={() => void executeAction(pendingAction)}
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
              <div><dt>申請者：</dt><dd>{displayedBorrowerName}さん</dd></div>
              <div><dt>書籍名：</dt><dd>{book.title}</dd></div>
            </dl>
            <div className="return-comment-preview">
              <strong>返却申請時の感想</strong>
              <p>{displayedReturnComment || '感想は入力されていません。'}</p>
            </div>
            <p>内容を確認し、返却申請の承認または却下を選択してください。</p>
          </div>
        </ModalDialog>
      )}
      <Toast open={Boolean(message)} message={message} severity={toastSeverity} onClose={() => setMessage('')} />
    </main>
  )
}

export default BookDetail
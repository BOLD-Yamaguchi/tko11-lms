import { HamburgerMenu } from './HamburgerMenu'
import type { HamburgerMenuItem } from './HamburgerMenu'
import { useLibraryDataValue } from '../data/libraryQueries'
import type { UserRole } from '../types'

type UserMenuProps = {
  role: UserRole
  items: readonly HamburgerMenuItem[]
  onSelect: (item: HamburgerMenuItem) => void
  title?: string
}

export function UserMenu({
  role,
  items,
  onSelect,
  title = '書籍管理',
}: UserMenuProps) {
  const data = useLibraryDataValue()
  const user = data.roleProfiles[role]

  return (
    <div className="user-menu">
      <span className={`logged-in-user ${role}`}>
        <span className="logged-in-prefix">ログイン中：</span>
        <strong>{user.label}</strong>
        <span className="logged-in-id">（{user.userId}）</span>
      </span>
      <HamburgerMenu
        title={title}
        subtitle={`${user.label}としてログイン中`}
        items={items}
        onSelect={onSelect}
      />
    </div>
  )
}

# CHLPS Admin Portal — Project Specification

## 1. Executive Summary & Tech Stack

The **CHLPS Admin Portal** is an enterprise dashboard for managing memberships, educational programs, courses, blog posts, events, certificates, students, payments, support queries, and administrative settings.

### Core Technology Stack
- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/) with Turbopack bundler.
- **Runtime & Package Manager**: [Bun](https://bun.sh/) (`bun`, `bun.lock`).
- **UI Library & CSS**: [Tailwind CSS v4](https://tailwindcss.com/) with [daisyUI 5](https://daisyui.com/) (`flipex` custom theme).
- **TypeScript**: TypeScript 5 + [`tsgo`](https://github.com/microsoft/typescript-go) for high-performance typechecking.
- **Form Management**: `react-hook-form` + `FormProvider` with atomic form input components.
- **Iconography**: `iconsax-react` and `lucide-react`.
- **State Management**: Zustand, Jotai, and Redux Toolkit.
- **Popper / Dropdowns**: `react-popper` via custom portal.

---

## 2. Global Development Directives

1. **Package Manager & Commands**:
   - Always execute scripts using **Bun**:
     - `bun dev`: Starts the Next.js development server.
     - `bun run typecheck`: Runs `tsgo --noEmit` across all workspace files.
     - `bun run build`: Builds the production bundle with Next.js Turbopack.
     - `bun add <package>`: Installs new dependencies.

2. **Next.js 16 Dynamic Route Params**:
   - In Next.js 16 App Router, dynamic route params must be awaited in server and client components:
     ```tsx
     export default async function Page({ params }: { params: Promise<{ id: string }> }) {
       const { id } = await params;
       return <DetailView id={id} />;
     }
     ```

---

## 3. DaisyUI & Design System Configuration

DaisyUI 5 is configured with the `flipex` theme inside `src/app/globals.css`.

### Semantic Color Tokens
| DaisyUI Token | Hex Value | Description |
|---|---|---|
| `--color-primary` | `#161058` | Navy blue brand primary |
| `--color-primary-content` | `#FFFFFF` | White text on primary |
| `--color-secondary` | `#717171` | Subdued gray for icons & subtitles |
| `--color-accent` | `#FFC107` | Amber accent |
| `--color-base-100` | `#F7F7F7` | Soft background |
| `--color-base-200` | `#F1F1F1` | Gray interactive highlight |
| `--color-base-300` | `#E7E9EB` | Crisp border tone |
| `--color-base-content` | `#000000` | Primary body text |
| `--color-success` | `#38CB89` | Positive green / active status |
| `--color-warning` | `#EED202` | Yellow warning status |
| `--color-error` | `#E84D52` | Destructive red / danger buttons |

---

## 4. UI Architecture & Standard Components

### 4.1. Tables (`CustomTable` & `PopUp`)
All listing screens standardize on `src/components/tables/CustomTable.tsx` and `src/components/tables/pop-up.tsx`:
- **Columns**: Array of `columnType<T>` with optional custom cell renderer (`render: (value, item) => ReactNode`).
- **Row Actions**: Array of `Actions<T>[]` with Popper 3-dot dropdown menu.
- **Pagination**: Synced via `usePagination()` or custom pagination state.
- **Row Click**: Optional `onRowClick` handler navigating to detail pages.

```tsx
import CustomTable, { columnType } from "@/components/tables/CustomTable";
import { Actions } from "@/components/tables/pop-up";

const columns: columnType<MyItem>[] = [
  { key: "name", label: "Name" },
  { key: "status", label: "Status", render: (val) => <StatusBadge status={val} /> }
];

const actions: Actions<MyItem>[] = [
  { key: "view", label: "View Details", action: (item, router) => router.push(`/items/${item.id}`) },
  { key: "delete", label: "Delete", render: () => <span className="text-error font-medium">Delete</span>, action: (item) => handleDelete(item.id) }
];
```

### 4.2. Modal Dialogs (`DialogModal`)
All dialogs utilize HTML `<dialog>` managed by `src/components/DialogModal.tsx`:
- Provides an imperative ref handle: `ref.current?.open()` and `ref.current?.close()`.
- Automatically unmounts children when closed to avoid stale state.

```tsx
import DialogModal, { ModalHandle } from "@/components/DialogModal";

const modalRef = useRef<ModalHandle>(null);

<DialogModal
  ref={modalRef}
  title="Create Item"
  actions={
    <>
      <button type="button" className="btn btn-ghost" onClick={() => modalRef.current?.close()}>Cancel</button>
      <button type="button" className="btn btn-primary" onClick={handleSave}>Save</button>
    </>
  }
>
  <MyForm />
</DialogModal>
```

### 4.3. Form Inputs (`src/components/inputs/`)
Forms standardize on `react-hook-form` and `<FormProvider>`:
- `SimpleInput`: Text, number, password inputs with validation state.
- `SimpleTextArea`: Multiline textarea with error feedback.
- `LocalSelect`: Local options dropdown registered with RHF.
- `SimpleSelect` / `SimpleMultiSelect`: Dynamic remote select with query state.
- `UpdateImages`: Multi-image file uploader with preview and remove triggers.

---

## 5. Feature Architecture

Each domain resides in `src/features/[feature_name]/`:

```
src/features/
├── membership/
│   ├── components/            # Modals, criteria checklists, metric cards
│   ├── domain/data/hooks/     # useMemberships, useMembershipDetail
│   ├── domain/data/response/  # Membership, MembershipSubscriber, MembershipTransaction
│   ├── domain/data/seed.ts    # Seed datasets & session mock store
│   └── pages/                 # membership_page.tsx, membership_detail_page.tsx
├── courses/
│   ├── components/            # add_course_modal.tsx (RHF + FormProvider)
│   ├── domain/data/hooks/     # useCourses
│   ├── domain/data/response/  # Course, CourseOutcome
│   └── pages/                 # courses_page.tsx, course_detail_page.tsx
├── programs/
│   ├── domain/data/hooks/     # usePrograms
│   ├── domain/data/response/  # Program
│   └── pages/                 # programs_page.tsx
├── blog/
├── events/
├── certificates/
├── students/
├── admins/
├── payments/
├── support/
└── testimonials/
```

---

## 6. Verification Checklist for Changes

Whenever updating or creating a new feature:
1. Run `bun run typecheck` (`tsgo --noEmit`) to ensure complete TypeScript compliance without errors.
2. Run `bun run build` to verify Next.js Turbopack generates all static and dynamic routes.
3. Ensure table views use `CustomTable` with `PopUp` actions.
4. Ensure modals use `DialogModal` (`ref.current?.open()`).
5. Ensure form views wrap fields in `<FormProvider>` and use `src/components/inputs/`.

# CogniFlow 设计系统文档

## 概述

本文档描述了 CogniFlow 项目的统一设计系统，包括颜色、间距、圆角、阴影、动画等设计令牌。所有样式都通过 CSS 变量和 Tailwind 配置统一管理，确保整个应用的一致性和可维护性。

## 设计原则

1. **语义化优先**：使用语义化的颜色名称（如 `primary`、`muted`）而非具体颜色值（如 `blue-600`）
2. **主题适配**：所有颜色自动适配亮色/暗色主题，无需手动添加 `dark:` 前缀
3. **统一管理**：所有设计令牌集中在 `src/index.css` 和 `tailwind.config.js` 中定义
4. **易于维护**：修改设计系统只需更新 CSS 变量，无需改动组件代码

---

## 快速参考

### 常用颜色替换对照表

#### 文本颜色

```tsx
// ❌ 旧的硬编码方式
<h1 className="text-gray-900 dark:text-white">标题</h1>
<p className="text-gray-600 dark:text-gray-400">描述</p>

// ✅ 新的设计系统方式
<h1 className="text-foreground">标题</h1>
<p className="text-muted-foreground">描述</p>
```

#### 背景颜色

```tsx
// ❌ 旧的硬编码方式
<div className="bg-white dark:bg-gray-900">页面</div>
<div className="bg-white dark:bg-gray-800">卡片</div>

// ✅ 新的设计系统方式
<div className="bg-background">页面</div>
<div className="bg-card">卡片</div>
```

#### 主题色

```tsx
// ❌ 旧的硬编码方式
<Button className="bg-blue-600 text-white">按钮</Button>
<Loader2 className="text-blue-600 dark:text-blue-400" />

// ✅ 新的设计系统方式
<Button className="bg-primary text-primary-foreground">按钮</Button>
<Loader2 className="text-primary" />
```

#### 边框颜色

```tsx
// ❌ 旧的硬编码方式
<div className="border border-gray-200 dark:border-gray-800">

// ✅ 新的设计系统方式
<div className="border border-border">
```

### 透明度使用

使用 `/` 语法设置透明度：

```tsx
// 5% 透明度的主题色背景
<div className="bg-primary/5">

// 30% 透明度的主题色边框
<div className="border-primary/30">

// 30% 透明度的静音文字
<Icon className="text-muted-foreground/30" />
```

---

## 颜色系统

### 基础颜色

所有颜色使用 HSL 格式定义，便于主题切换和透明度控制。

#### 语义化颜色

| 变量名 | 用途 | 亮色模式 | 暗色模式 |
|--------|------|---------|---------|
| `--background` | 页面背景 | 白色 | 深蓝灰 |
| `--foreground` | 主要文本 | 深蓝灰 | 浅色 |
| `--card` | 卡片背景 | 白色 | 深蓝灰 |
| `--card-foreground` | 卡片文本 | 深蓝灰 | 浅色 |
| `--primary` | 主题色 | 深蓝 | 蓝色 |
| `--primary-foreground` | 主题色上的文字 | 浅色 | 白色 |
| `--secondary` | 次要背景 | 浅蓝灰 | 深蓝灰 |
| `--muted` | 静音背景 | 浅灰 | 深蓝灰 |
| `--muted-foreground` | 静音文本 | 中灰 | 中灰 |
| `--accent` | 强调背景 | 浅蓝灰 | 深蓝灰 |
| `--destructive` | 危险色 | 红色 | 深红 |
| `--border` | 边框 | 浅灰 | 深蓝灰 |
| `--input` | 输入框边框 | 浅灰 | 深蓝灰 |
| `--ring` | 焦点环 | 深蓝灰 | 浅灰 |

### 类型颜色系统

用于区分不同类型的条目（任务、日程、笔记等）。

#### 使用方式

```tsx
import { getTypeBadgeClasses } from '@/styles/color-utils';

<Badge className={getTypeBadgeClasses('task')}>
  任务
</Badge>
```

#### 类型颜色列表

| 类型 | 颜色 | CSS 变量 |
|------|------|---------|
| Task (任务) | 蓝色 | `--type-task-bg`, `--type-task-text`, `--type-task-border` |
| Event (日程) | 绿色 | `--type-event-bg`, `--type-event-text`, `--type-event-border` |
| Note (笔记) | 黄色 | `--type-note-bg`, `--type-note-text`, `--type-note-border` |
| Data (资料) | 紫色 | `--type-data-bg`, `--type-data-text`, `--type-data-border` |
| URL (链接) | 青色 | `--type-url-bg`, `--type-url-text`, `--type-url-border` |
| Collection (合集) | 粉色 | `--type-collection-bg`, `--type-collection-text`, `--type-collection-border` |

### 状态颜色系统

用于表示不同的状态（成功、警告、错误、信息）。

#### 使用方式

```tsx
import { getStatusBadgeClasses } from '@/styles/color-utils';

<Badge className={getStatusBadgeClasses('success')}>
  成功
</Badge>
```

#### 状态颜色列表

| 状态 | 颜色 | CSS 变量 |
|------|------|---------|
| Success (成功) | 绿色 | `--status-success-bg`, `--status-success-text`, `--status-success-border` |
| Warning (警告) | 黄色 | `--status-warning-bg`, `--status-warning-text`, `--status-warning-border` |
| Error (错误) | 红色 | `--status-error-bg`, `--status-error-text`, `--status-error-border` |
| Info (信息) | 蓝色 | `--status-info-bg`, `--status-info-text`, `--status-info-border` |

### 优先级颜色系统

用于表示任务的优先级。

#### 使用方式

```tsx
import { getPriorityBorderClasses } from '@/styles/color-utils';

<div className={getPriorityBorderClasses('high')}>
  高优先级任务
</div>
```

#### 优先级颜色列表

| 优先级 | 颜色 | CSS 变量 |
|--------|------|---------|
| High (高) | 红色 | `--priority-high-border`, `--priority-high-bg` |
| Medium (中) | 黄色 | `--priority-medium-border`, `--priority-medium-bg` |
| Low (低) | 绿色 | `--priority-low-border`, `--priority-low-bg` |

## 间距系统

使用 Tailwind 的标准间距系统，基于 4px 的倍数：

- `xs`: 4px (0.25rem)
- `sm`: 8px (0.5rem)
- `md`: 12px (0.75rem)
- `lg`: 16px (1rem)
- `xl`: 24px (1.5rem)
- `2xl`: 32px (2rem)
- `3xl`: 40px (2.5rem)
- `4xl`: 48px (3rem)

## 圆角系统

- `sm`: 4px (0.25rem)
- `md`: 8px (0.5rem)
- `lg`: 12px (0.75rem)
- `xl`: 16px (1rem)
- `2xl`: 24px (1.5rem)
- `full`: 完全圆形

基础圆角通过 `--radius` 变量控制，默认 `0.5rem`。

## 阴影系统

所有阴影通过 CSS 变量定义，自动适配主题：

- `--shadow-sm`: 小阴影
- `--shadow-md`: 中等阴影
- `--shadow-lg`: 大阴影
- `--shadow-xl`: 超大阴影
- `--shadow-2xl`: 最大阴影
- `--shadow-card`: 卡片阴影
- `--shadow-hover`: 悬浮阴影

## 动画系统

### 过渡时间

- `--transition-fast`: 150ms
- `--transition-normal`: 200ms
- `--transition-slow`: 300ms
- `--transition-slower`: 500ms

### 缓动函数

使用 `cubic-bezier(0.4, 0, 0.2, 1)` 作为标准缓动函数。

## 使用指南

### 1. 文本颜色

```tsx
// ❌ 错误：硬编码颜色
<p className="text-gray-900 dark:text-white">文本</p>

// ✅ 正确：使用语义化颜色
<p className="text-foreground">文本</p>
<p className="text-muted-foreground">次要文本</p>
```

### 2. 背景颜色

```tsx
// ❌ 错误：硬编码颜色
<div className="bg-white dark:bg-gray-900">容器</div>

// ✅ 正确：使用语义化颜色
<div className="bg-background">页面</div>
<div className="bg-card">卡片</div>
<div className="bg-muted">次要背景</div>
```

### 3. 边框颜色

```tsx
// ❌ 错误：硬编码颜色
<div className="border border-gray-200 dark:border-gray-800">容器</div>

// ✅ 正确：使用语义化颜色
<div className="border border-border">容器</div>
```

### 4. 类型颜色

```tsx
// ❌ 错误：硬编码类型颜色
<Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
  任务
</Badge>

// ✅ 正确：使用类型颜色工具函数
import { getTypeBadgeClasses } from '@/styles/color-utils';

<Badge className={getTypeBadgeClasses('task')}>
  任务
</Badge>
```

### 5. 状态颜色

```tsx
// ❌ 错误：硬编码状态颜色
<div className="bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400">
  错误
</div>

// ✅ 正确：使用状态颜色工具函数
import { getStatusBadgeClasses } from '@/styles/color-utils';

<Badge className={getStatusBadgeClasses('error')}>
  错误
</Badge>
```

### 6. 透明度

使用 Tailwind 的透明度语法：

```tsx
<div className="bg-primary/10">10% 透明度的主题色</div>
<div className="text-muted-foreground/50">50% 透明度的静音文本</div>
<div className="border-primary/30">30% 透明度的主题色边框</div>
```

## 工具类

### 卡片样式

```tsx
<div className="card-base card-hover">
  卡片内容
</div>
```

### 按钮样式

```tsx
<button className="btn-ghost-hover">
  按钮
</button>
```

### 输入框样式

```tsx
<input className="input-base input-focus" />
```

## 文件结构

```
src/
├── index.css              # 设计系统 CSS 变量定义
├── styles/
│   ├── design-tokens.ts   # 设计令牌 TypeScript 定义
│   └── color-utils.ts     # 颜色工具函数
└── components/            # 组件（使用设计系统）
```

## 迁移指南

### 从硬编码颜色迁移到设计系统

1. **查找硬编码颜色**：
   ```bash
   grep -r "text-gray-\|bg-gray-\|text-blue-\|bg-blue-" src/components/
   ```

2. **替换为语义化颜色**：
   - `text-gray-900 dark:text-white` → `text-foreground`
   - `bg-white dark:bg-gray-900` → `bg-background`
   - `text-blue-600 dark:text-blue-400` → `text-primary`
   - `bg-blue-100 dark:bg-blue-900` → `bg-type-task-bg` (如果是任务类型)

3. **使用工具函数**：
   - 类型颜色：使用 `getTypeBadgeClasses()`
   - 状态颜色：使用 `getStatusBadgeClasses()`
   - 优先级颜色：使用 `getPriorityBorderClasses()`

## 最佳实践

1. **始终使用语义化颜色**：避免使用具体的颜色值（如 `blue-600`）
2. **利用透明度**：使用 `/` 语法设置透明度，而不是创建新的颜色变量
3. **统一动画**：使用设计系统中定义的过渡时间
4. **响应式设计**：使用 Tailwind 的响应式前缀（`sm:`, `md:`, `lg:` 等）
5. **保持一致性**：相似的元素使用相同的样式类

## 更新日志

### 2025-11-05
- 创建统一的设计系统
- 添加类型颜色、状态颜色、优先级颜色系统
- 重构 ItemCard 组件使用新的设计系统
- 优化全局样式和工具类


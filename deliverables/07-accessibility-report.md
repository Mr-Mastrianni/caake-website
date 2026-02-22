# C.A.A.K.E. Corporation - Accessibility Requirements

## WCAG 2.2 AA Target

### Color Contrast Requirements

| Element | Minimum Ratio | Target |
|---------|---------------|--------|
| Normal text | 4.5:1 | 7:1 (AAA) |
| Large text (18pt+) | 3:1 | 4.5:1 |
| UI Components | 3:1 | 4.5:1 |
| Focus indicators | 3:1 | 4.5:1 |

**Our Implementation**:
- `--text-primary` (#FAFAFA) on `--color-midnight` (#0A0A0F): **19.4:1** ✅
- `--color-gold` (#D4AF37) on `--color-midnight`: **7.8:1** ✅
- `--text-secondary` (#A1A1AA) on `--color-midnight`: **8.6:1** ✅

### Keyboard Navigation

**Requirements**:
- [ ] All interactive elements focusable
- [ ] Logical tab order
- [ ] Visible focus indicators
- [ ] No keyboard traps
- [ ] Skip links for navigation

**Implementation**:
```css
:focus-visible {
  outline: 2px solid var(--color-gold);
  outline-offset: 2px;
}

.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: var(--color-gold);
  color: var(--color-midnight);
  padding: 8px;
  z-index: 100;
}

.skip-link:focus {
  top: 0;
}
```

### Screen Reader Support

**Required ARIA**:
- `aria-label` on icon-only buttons
- `aria-expanded` on dropdowns
- `aria-current="page"` on active nav
- `aria-live` for dynamic content
- `role` landmarks (main, nav, complementary)

### Motion Preferences

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
  
  .parallax {
    transform: none !important;
  }
}
```

### Form Accessibility

- [ ] Labels associated with inputs (`for`/`id`)
- [ ] Error messages linked via `aria-describedby`
- [ ] Required fields indicated
- [ ] Clear error prevention

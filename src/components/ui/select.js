import * as React from 'react';
import clsx from 'clsx';


export function Select({ value, onChange, children, className, placeholder = 'Select' }) {
    const [open, setOpen] = React.useState(false);
    const triggerRef = React.useRef(null);
    const listRef = React.useRef(null);
    const items = React.Children.toArray(children)
        .filter(c => React.isValidElement(c) && c.type === SelectItem)
        .map(c => ({ value: c.props.value, label: c.props.children }));

    const activeIndex = items.findIndex(i => i.value === value);

    function close() { setOpen(false); }
    function toggle() { setOpen(o => !o); }
    function selectVal(v) { onChange?.(v); close(); triggerRef.current?.focus(); }

    React.useEffect(() => {
        if (!open) return;
        function handler(e) {
            if (!triggerRef.current) return;
            if (triggerRef.current.contains(e.target) || listRef.current?.contains(e.target)) return;
            close();
        }
        window.addEventListener('mousedown', handler);
        window.addEventListener('touchstart', handler);
        return () => { window.removeEventListener('mousedown', handler); window.removeEventListener('touchstart', handler); };
    }, [open]);

    function onKeyDown(e) {
        if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(e.key)) e.preventDefault();
        if (!open && (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === ' ' || e.key === 'Enter')) {
            setOpen(true); return;
        }
        if (open) {
            if (e.key === 'Escape') close();
            if (e.key === 'Enter' || e.key === ' ') selectVal(items[Math.max(0, activeIndex)].value);
            if (e.key === 'ArrowDown') {
                const next = activeIndex < items.length - 1 ? activeIndex + 1 : 0;
                onChange?.(items[next].value);
            }
            if (e.key === 'ArrowUp') {
                const prev = activeIndex > 0 ? activeIndex - 1 : items.length - 1;
                onChange?.(items[prev].value);
            }
        }
    }

    return (
        <div className={clsx('relative', className)}>
            <button
                ref={triggerRef}
                type="button"
                className={clsx('h-10 w-full rounded-md border text-left px-3 py-2 text-sm flex items-center justify-between select-none transition-colors',
                    'border-neutral-300 bg-white shadow-sm',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400')}
                aria-haspopup="listbox"
                aria-expanded={open}
                onClick={toggle}
                onKeyDown={onKeyDown}
            >
                <span className={clsx('truncate', !value && 'text-neutral-400')}>{items.find(i => i.value === value)?.label || placeholder}</span>
                <svg width="16" height="16" viewBox="0 0 24 24" className={clsx('transition-transform', open && 'rotate-180')} aria-hidden>
                    <path fill="currentColor" d="M7 10l5 5 5-5H7z" />
                </svg>
            </button>
            {open && (
                <ul
                    ref={listRef}
                    role="listbox"
                    tabIndex={-1}
                    className={clsx('absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border border-neutral-200 bg-white p-1 shadow-md animate-in fade-in-0 zoom-in-95')}
                >
                    {items.map(it => {
                        const active = it.value === value;
                        return (
                            <li
                                key={it.value}
                                role="option"
                                aria-selected={active}
                                onClick={() => selectVal(it.value)}
                                className={clsx('cursor-pointer select-none rounded-sm px-2 py-1.5 text-sm flex items-center justify-between',
                                    active ? 'bg-neutral-900 text-white' : 'hover:bg-neutral-100')}
                            >
                                <span className="truncate">{it.label}</span>
                                {active && (
                                    <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden className="opacity-80">
                                        <path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                                    </svg>
                                )}
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
}

export function SelectItem() { /* captured by parent above; no direct render */ return null; }
export function SelectTrigger({ children }) { return children; }
export function SelectContent({ children }) { return children; }

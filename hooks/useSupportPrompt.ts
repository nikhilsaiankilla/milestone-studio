import { useState, useEffect } from 'react'

const STORAGE_KEYS = {
    exportCount: 'export_count',
    nextEligibleAt: 'export_next_eligible',
    dismissedPermanently: 'export_dismissed_permanent',
}

export function useSupportPrompt() {
    const [open, setOpen] = useState(false)

    const getCount = () =>
        Number(localStorage.getItem(STORAGE_KEYS.exportCount) || 0)

    const increment = () => {
        const count = getCount() + 1
        localStorage.setItem(STORAGE_KEYS.exportCount, String(count))
        return count
    }

    const shouldShow = (count: number) => {
        const dismissed = localStorage.getItem(STORAGE_KEYS.dismissedPermanently)
        if (dismissed === 'true') return false

        const nextEligible = Number(localStorage.getItem(STORAGE_KEYS.nextEligibleAt) || 0)
        if (count < nextEligible) return false

        return count % 3 === 0
    }

    const triggerCheck = () => {
        const count = increment()
        if (shouldShow(count)) setOpen(true)
    }

    const dismissTemporarily = () => {
        const current = getCount()
        localStorage.setItem(STORAGE_KEYS.nextEligibleAt, String(current + 3))
        setOpen(false)
    }

    const dismissPermanently = () => {
        localStorage.setItem(STORAGE_KEYS.dismissedPermanently, 'true')
        setOpen(false)
    }

    return {
        open,
        setOpen,
        triggerCheck,
        dismissTemporarily,
        dismissPermanently,
    }
}